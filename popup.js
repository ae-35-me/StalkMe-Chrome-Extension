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

async function checkBuiltInAI() {
    const statusDiv = document.getElementById('aiStatus');
    const analyzeButton = document.getElementById('analyzeButton');
    const recheckButton = document.getElementById('recheckButton');

    statusDiv.textContent = 'Checking AI availability...';
    statusDiv.style.color = '#555';
    analyzeButton.disabled = true;
    recheckButton.style.display = 'none';

    try {
        // First, check if we're in a context that has the AI API
        if (typeof window.ai !== 'undefined' && window.ai.languageModel) {
            statusDiv.textContent = '✅ Chrome Built-in AI ready!';
            statusDiv.style.color = 'green';
            analyzeButton.disabled = false;
            return;
        }

        // If not in popup, try to check via content script in active tab
        statusDiv.textContent = 'Checking AI in page context...';

        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!activeTab) {
            throw new Error('No active tab found');
        }

        // Check if AI is available in the page context
        const results = await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
                return {
                    hasAI: typeof window.ai !== 'undefined' && !!window.ai.languageModel,
                    url: window.location.href
                };
            }
        });

        if (results[0].result && results[0].result.hasAI) {
            statusDiv.textContent = '✅ Chrome Built-in AI available in page context!';
            statusDiv.style.color = 'green';
            analyzeButton.disabled = false;
            window.hasPageAIAccess = true;
        } else {
            statusDiv.textContent = '❌ AI API not available on this page. Try a different website.';
            statusDiv.style.color = '#d93025';
            recheckButton.style.display = 'block';
        }

    } catch (error) {
        console.error('AI check failed:', error);
        statusDiv.textContent = `❌ Error: ${error.message}`;
        statusDiv.style.color = '#d93025';
        recheckButton.style.display = 'block';
    }
}

async function analyzeTabs() {
    const resultDiv = document.getElementById('aiResult');
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Analyzing your online life...';

    try {
        const tabs = await chrome.tabs.query({});
        const tabData = tabs.map(t => `- ${t.title} (${t.url})`).join('\n');

        const prompt = `
You are a creepy, observant AI. I am going to give you a list of open browser tabs. 
Your job is to describe what the user is doing, what their personality might be, and what they are interested in.
Make it sound slightly unsettling, like you are watching them closely. Keep it to 2-3 sentences.

Tabs:
${tabData}
    `;

        // Get active tab for AI execution
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!activeTab) {
            throw new Error('No active tab found for AI execution');
        }

        // Execute AI in page context
        const results = await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            args: [prompt],
            func: async (promptText) => {
                try {
                    // Check if AI is available in this page
                    if (typeof window.ai === 'undefined' || !window.ai.languageModel) {
                        return { error: 'AI not available on this page' };
                    }

                    // Create session and generate summary
                    const session = await window.ai.languageModel.create();
                    const summary = await session.prompt(promptText);
                    return { success: true, summary };
                } catch (error) {
                    return { error: error.message };
                }
            }
        });

        const aiResult = results[0].result;

        if (aiResult.error) {
            resultDiv.textContent = `AI Error: ${aiResult.error}\n\nTry navigating to a regular website (not chrome:// or extension pages) and try again.`;
        } else if (aiResult.success) {
            resultDiv.textContent = aiResult.summary;
        }

    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
        console.error('Analysis failed:', error);
    }
}

document.getElementById('actionButton').addEventListener('click', () => {
    displayCookies();
});

document.getElementById('analyzeButton').addEventListener('click', () => {
    analyzeTabs();
});

document.getElementById('recheckButton').addEventListener('click', () => {
    checkBuiltInAI();
});

// Load on startup
displayCookies();
checkBuiltInAI();

// Debug info
document.getElementById('debugInfo').textContent = navigator.userAgent;
