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
                value.textContent = `Password: ${item.valueLength} characters typed`;
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

