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

async function analyzeTabs() {
    const apiKey = document.getElementById('apiKey').value;
    const resultDiv = document.getElementById('aiResult');

    if (!apiKey) {
        alert('Please enter a Gemini API Key.');
        return;
    }

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

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const text = data.candidates[0].content.parts[0].text;
        resultDiv.textContent = text;

    } catch (error) {
        resultDiv.textContent = 'Error analyzing tabs: ' + error.message;
    }
}

document.getElementById('actionButton').addEventListener('click', () => {
    displayCookies();
});

document.getElementById('analyzeButton').addEventListener('click', () => {
    analyzeTabs();
});

// Load on startup
displayCookies();

// Debug info
document.getElementById('debugInfo').textContent = navigator.userAgent;
