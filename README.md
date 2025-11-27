# StalkMe Chrome Extension 🕵️‍♂️

**StalkMe** is a demonstration Chrome Extension designed to highlight privacy risks associated with browser extensions that request excessive permissions.

## Features

*   **🍪 Cookie Tracker**: Displays all cookies across all sites and highlights potential **Session Tokens** in red (based on name patterns and security flags).
*   **🔍 Sensitive Data Scanner**: Scans all open tabs for numbers matching the pattern `xxx-xxx-xxx` or `xxx-xxx-xxxx` (like phone numbers, TFNs, etc.) and displays which tab they were found on.
*   **⚠️ Form Input Monitor**: Demonstrates how extensions can intercept data typed into forms, including passwords. Captures and displays form inputs to show the real risk of credential theft.
*   **🔒 Privacy First**: All analysis happens locally in your browser (no external servers).

## Installation

1.  Clone this repository.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable **Developer Mode** (top right).
4.  Click **Load unpacked**.
5.  Select the directory containing this extension.
6.  **Important**: Click "Details" on the extension card, scroll down and enable "Allow access to file URLs" to test with `sample_page.html`.

## Usage

1.  Click the extension icon in your browser toolbar.
2.  **Track Me (Refresh Cookies)**: View all cookies and highlighted session tokens.
3.  **Scan Tabs for Numbers**: Scan all open tabs for sensitive numbers in the format `xxx-xxx-xxx`.
4.  **Start Monitoring Form Inputs**: Inject monitoring code into all open tabs to capture typed data.
5.  **View Captured Data**: See what form data (including passwords) was intercepted.

## Testing

A sample page (`sample_page.html`) is included for demonstration purposes. Open this file in Chrome to test the features:
- **Number scanning**: Contains a randomly generated TFN that changes on each page load
- **Form monitoring**: Has a login form to demonstrate credential interception

### Testing Form Monitoring
1. Open `sample_page.html` in Chrome
2. Open the extension popup
3. Click "Start Monitoring Form Inputs"
4. Type a username and password in the sample page form
5. Click "View Captured Data" in the popup
6. See your typed credentials displayed (passwords shown as character count)

> [!NOTE]
> **File URL Access**: The requirement to enable "Allow access to file URLs" is unique to testing with local HTML files (`sample_page.html`). In real-world scenarios, extensions with these permissions can access **all regular websites** (https:// and http://) without any additional user approval. This testing limitation does not reduce the security implications demonstrated by this extension.

## Permissions & Privacy Risks

This extension requests the following permissions, which demonstrate how much access an extension can have:

### Core Permissions
- **`webRequest`** - Allows the extension to intercept and read all network requests you make. This means it can see every website you visit, every API call, and potentially capture sensitive data in transit.
- **`webRequestBlocking`** - Allows the extension to block or modify network requests. A malicious extension could redirect you to phishing sites, inject malicious code, or prevent security updates.
- **`tabs`** - Grants access to all your open tabs, including titles and URLs. The extension can see your entire browsing session across all tabs.
- **`scripting`** - Allows the extension to inject and execute JavaScript code on any webpage you visit. This could be used to steal passwords, bank details, or modify page content.
- **`cookies`** - Provides access to all cookies from all websites. This includes session tokens that could be used to impersonate you on websites (account takeover).
- **`storage`** - Allows the extension to store data locally. While less risky, this could be used to track your behavior over time.

### Host Permissions
- **`https://*/*` and `http://*/*`** - Grants access to ALL websites you visit, both secure and insecure. Combined with the scripting permission, this is extremely dangerous as it allows the extension to read and modify any webpage.

> [!WARNING]
> **These permissions combined allow an extension to:**
> - Read and steal passwords as you type them
> - Capture session tokens and impersonate you on websites
> - Track every website you visit
> - Read sensitive personal information from web pages
> - Modify web pages to inject malicious content or phishing forms
> - Intercept and steal financial information during online banking or shopping

## Disclaimer

This extension is for **educational and demonstration purposes only**. It requests extensive permissions (`webRequest`, `cookies`, `tabs`, `scripting`, `storage`) to demonstrate how much data an extension can access. **Use with caution** and only install extensions from trusted sources.
