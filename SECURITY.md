# Security Policy

## Purpose

**StalkMe** is an educational Chrome extension designed to demonstrate security and privacy risks. This extension intentionally requests extensive permissions to show what malicious extensions could potentially access.

## ⚠️ Important Security Notice

> [!CAUTION]
> This extension is for **educational and demonstration purposes only**. It is designed to highlight privacy risks and should **NOT** be used in production environments or on systems with sensitive data.

### What This Extension Demonstrates

This extension shows how browser extensions with excessive permissions can:
- Intercept and read all cookies from all websites
- Capture form inputs including passwords in plaintext
- Monitor all network traffic and extract authorization headers
- Inject content into web pages
- Access data from all open browser tabs

## Intended Use

✅ **Appropriate Uses:**
- Security awareness training
- Privacy risk demonstrations
- Educational purposes in controlled environments
- Understanding browser extension permissions

❌ **Inappropriate Uses:**
- Production environments
- Systems with real user data
- Malicious purposes or unauthorized monitoring
- Any use that violates privacy laws or regulations

## Reporting Security Issues

If you discover a security vulnerability in this demonstration extension, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email security concerns to: [Your contact email or create a security@yourdomain.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

We will respond within 48 hours and work to address legitimate security concerns.

## Responsible Disclosure

We follow responsible disclosure practices:
- Security issues will be addressed promptly
- Reporters will be credited (if desired)
- Fixes will be released before public disclosure
- Security advisories will be published for significant issues

## Extension Permissions

This extension requests the following permissions (intentionally extensive for demonstration):
- `webRequest` & `webRequestBlocking` - Network traffic interception
- `cookies` - Cookie access across all sites
- `tabs` - Tab information and content access
- `scripting` - JavaScript injection capabilities
- `storage` - Local data storage
- Host permissions: `<all_urls>` - Access to all websites

## Privacy Notice

**Data Collection:** This extension processes data **locally only**. No data is transmitted to external servers. All analysis happens in your browser.

**Data Storage:** Captured data is stored temporarily in browser memory and is cleared when the extension popup is closed.

## Questions?

For questions about this security demonstration or to report concerns, please open a GitHub issue or contact the maintainers.

---

*Remember: Only install browser extensions from trusted sources and review permissions carefully!*
