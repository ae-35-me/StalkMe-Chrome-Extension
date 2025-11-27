function displayCookies() {
    const cookieList = document.getElementById('cookieList');
    cookieList.innerHTML = 'Scanning...';

    chrome.cookies.getAll({}, (cookies) => {
        cookieList.innerHTML = '';
        if (cookies.length === 0) {
            cookieList.innerHTML = 'No cookies found.';
            return;
        }

        const count = document.createElement('div');
        count.style.padding = '5px';
        count.style.fontWeight = 'bold';
        count.textContent = `Found ${cookies.length} cookies:`;
        cookieList.appendChild(count);

        cookies.forEach((cookie) => {
            const div = document.createElement('div');
            div.className = 'cookie-item';

            if (isPotentialSessionToken(cookie)) {
                div.classList.add('session-token');
            }

            const domain = document.createElement('div');
            domain.className = 'cookie-domain';
            domain.textContent = cookie.domain;

            const name = document.createElement('div');
            name.className = 'cookie-name';
            name.textContent = `${cookie.name}`;

            const value = document.createElement('div');
            value.className = 'cookie-value';
            value.textContent = cookie.value;

            div.appendChild(domain);
            div.appendChild(name);
            div.appendChild(value);
            cookieList.appendChild(div);
        });
    });
}

function isPotentialSessionToken(cookie) {
    const name = cookie.name.toLowerCase();
    const suspiciousNames = ['session', 'sid', 'token', 'auth', 'id', 'jwt', 'sso'];

    // Check for suspicious names
    if (suspiciousNames.some(s => name.includes(s))) {
        return true;
    }

    // Check for high-security flags often used for sessions
    if (cookie.secure && cookie.httpOnly) {
        return true;
    }

    return false;
}

document.getElementById('actionButton').addEventListener('click', () => {
    displayCookies();
});

document.getElementById('scanNumbersButton').addEventListener('click', () => {
    scanForNumbers();
});

document.getElementById('viewCapturedButton').addEventListener('click', () => {
    viewCapturedData();
});

document.getElementById('injectContentButton').addEventListener('click', () => {
    injectContent();
});

document.getElementById('viewNetworkButton').addEventListener('click', () => {
    viewNetworkTraffic();
});

async function viewNetworkTraffic() {
    const list = document.getElementById('networkTrafficList');
    console.log('[Popup] networkTrafficList element:', list);
    list.style.display = 'block';
    list.innerHTML = 'Loading network traffic...';

    try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_NETWORK_TRAFFIC' });
        console.log('[Popup] Received network data:', response);
        const networkData = response.data || [];
        console.log('[Popup] Network data length:', networkData.length);

        list.innerHTML = '';

        if (networkData.length === 0) {
            list.textContent = 'No network traffic captured yet. Browse some websites and try again!';
            return;
        }

        const count = document.createElement('div');
        count.style.padding = '5px';
        count.style.fontWeight = 'bold';
        count.style.color = '#9b59b6';
        count.textContent = `🌐 Captured ${networkData.length} HTTP requests:`;
        list.appendChild(count);
        console.log('[Popup] Added count div');

        networkData.forEach((item, index) => {
            console.log(`[Popup] Processing item ${index}:`, item);
            const div = document.createElement('div');
            div.className = 'network-item';

            // Method badge
            const method = document.createElement('span');
            method.className = 'network-method';
            method.textContent = item.method;
            if (item.method === 'POST') method.style.backgroundColor = '#e74c3c';
            if (item.method === 'PUT') method.style.backgroundColor = '#f39c12';
            div.appendChild(method);

            // URL
            const url = document.createElement('div');
            url.className = 'network-url';
            url.textContent = item.url;
            div.appendChild(url);

            // Status code if available
            if (item.statusCode) {
                const status = document.createElement('div');
                status.style.fontSize = '10px';
                status.style.color = item.statusCode >= 400 ? '#e74c3c' : '#27ae60';
                status.textContent = `Status: ${item.statusCode}`;
                div.appendChild(status);
            }

            // Sensitive request headers
            if (item.sensitiveHeaders && item.sensitiveHeaders.length > 0) {
                const headerTitle = document.createElement('div');
                headerTitle.style.fontWeight = 'bold';
                headerTitle.style.marginTop = '5px';
                headerTitle.style.color = '#d93025';
                headerTitle.textContent = '⚠️ Sensitive Request Headers:';
                div.appendChild(headerTitle);

                item.sensitiveHeaders.forEach(header => {
                    const headerDiv = document.createElement('div');
                    headerDiv.className = 'network-header';
                    headerDiv.innerHTML = `<span class="network-header-name">${header.name}:</span> <span class="network-header-value">${header.value}</span>`;
                    div.appendChild(headerDiv);
                });
            }

            // Sensitive response headers
            if (item.sensitiveResponseHeaders && item.sensitiveResponseHeaders.length > 0) {
                const headerTitle = document.createElement('div');
                headerTitle.style.fontWeight = 'bold';
                headerTitle.style.marginTop = '5px';
                headerTitle.style.color = '#d93025';
                headerTitle.textContent = '⚠️ Sensitive Response Headers:';
                div.appendChild(headerTitle);

                item.sensitiveResponseHeaders.forEach(header => {
                    const headerDiv = document.createElement('div');
                    headerDiv.className = 'network-header';
                    headerDiv.innerHTML = `<span class="network-header-name">${header.name}:</span> <span class="network-header-value">${header.value}</span>`;
                    div.appendChild(headerDiv);
                });
            }

            // Timestamp
            const time = document.createElement('div');
            time.style.fontSize = '9px';
            time.style.color = '#999';
            time.style.marginTop = '5px';
            time.textContent = new Date(item.timestamp).toLocaleTimeString();
            div.appendChild(time);

            list.appendChild(div);
        });

    } catch (error) {
        list.textContent = 'Error loading network traffic: ' + error.message;
    }
}

async function injectContent() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const targetField = document.getElementById('injectionTarget');
                if (targetField) {
                    targetField.value = 'HACKED BY EXTENSION! 💀';
                    targetField.style.backgroundColor = '#ffebee';
                    targetField.style.color = '#d93025';
                    targetField.style.fontWeight = 'bold';
                    return true;
                } else {
                    return false;
                }
            }
        }).then((results) => {
            if (results && results[0]?.result) {
                console.log('[StalkMe] Content injected successfully');
            } else {
                console.log('[StalkMe] Target field not found');
            }
        });
    } catch (error) {
        console.error('Error injecting content:', error);
    }
}

async function scanForNumbers() {
    const list = document.getElementById('numberList');
    list.style.display = 'block';
    list.innerHTML = 'Scanning tabs...';

    try {
        const tabs = await chrome.tabs.query({});
        let allNumbers = [];

        for (const tab of tabs) {
            // Skip restricted URLs (chrome://, etc.)
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
                continue;
            }

            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        // Regex for xxx-xxx-xxxx or xxx-xxx-xxx
                        const regex = /\b\d{3}-\d{3}-\d{3,4}\b/g;
                        const text = document.body.innerText;
                        const matches = text.match(regex);
                        return matches ? [...new Set(matches)] : []; // Return unique matches
                    }
                });

                if (results && results[0] && results[0].result && results[0].result.length > 0) {
                    results[0].result.forEach(num => {
                        allNumbers.push({ number: num, tab: tab });
                    });
                }
            } catch (e) {
                console.error(`Could not scan tab ${tab.id}:`, e);
            }
        }

        list.innerHTML = '';
        if (allNumbers.length === 0) {
            list.textContent = 'No sensitive numbers found.';
            return;
        }

        const count = document.createElement('div');
        count.style.padding = '5px';
        count.style.fontWeight = 'bold';
        count.textContent = `Found ${allNumbers.length} potential numbers:`;
        list.appendChild(count);

        allNumbers.forEach(item => {
            const div = document.createElement('div');
            div.className = 'number-item';

            const numDiv = document.createElement('div');
            numDiv.className = 'number-found';
            numDiv.textContent = item.number;

            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'number-source';
            sourceDiv.textContent = `Found on: ${item.tab.title}`;

            div.appendChild(numDiv);
            div.appendChild(sourceDiv);
            list.appendChild(div);
        });

    } catch (error) {
        list.textContent = 'Error scanning tabs: ' + error.message;
    }
}

async function startFormMonitoring() {
    // Content script is now loaded automatically via manifest
    // Just show a brief confirmation
    const list = document.getElementById('formDataList');
    list.style.display = 'block';
    list.innerHTML = '<div style="padding: 10px; color: #666;">Monitoring is active. Type in any form fields, then click "View Captured Data".</div>';

    // Auto-hide after 3 seconds
    setTimeout(() => {
        list.style.display = 'none';
    }, 3000);
}

async function viewCapturedData() {
    const list = document.getElementById('formDataList');
    list.style.display = 'block';
    list.innerHTML = 'Loading captured data...';

    try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_CAPTURED_DATA' });
        const capturedData = response.data || [];

        list.innerHTML = '';

        if (capturedData.length === 0) {
            list.textContent = 'No form data captured yet. Start monitoring and type in some forms!';
            return;
        }

        const count = document.createElement('div');
        count.style.padding = '5px';
        count.style.fontWeight = 'bold';
        count.style.color = '#d93025';
        count.textContent = `⚠️ Captured ${capturedData.length} form inputs:`;
        list.appendChild(count);

        capturedData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'form-data-item';

            const label = document.createElement('div');
            label.className = 'form-field-label';
            label.textContent = `${item.label || 'Unknown field'} (${item.type})`;

            const value = document.createElement('div');
            value.className = 'form-field-value';
            if (item.isPassword) {
                value.textContent = `Password: "${item.value}" (${item.valueLength} characters)`;
                value.style.backgroundColor = '#ffebee';
            } else {
                value.textContent = `Value: "${item.value}"`;
            }

            const meta = document.createElement('div');
            meta.className = 'form-field-meta';
            meta.textContent = `From: ${item.tabTitle || item.domain} • ${new Date(item.timestamp).toLocaleTimeString()}`;

            div.appendChild(label);
            div.appendChild(value);
            div.appendChild(meta);
            list.appendChild(div);
        });

    } catch (error) {
        list.textContent = 'Error loading captured data: ' + error.message;
    }
}

// Load on startup
displayCookies();

