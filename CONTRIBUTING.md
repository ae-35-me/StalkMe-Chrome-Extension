# Contributing to StalkMe

Thank you for your interest in contributing to StalkMe! This educational security demonstration benefits from community input.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. This is an educational tool, and we welcome contributions that enhance its demonstration value.

## How to Contribute

### Reporting Issues

Found a bug or have a suggestion? Please open a GitHub issue with:
- **Clear title** describing the issue
- **Detailed description** of the problem or suggestion  
- **Steps to reproduce** (for bugs)
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Browser version** and OS

### Suggesting Enhancements

We welcome ideas for improving the security demonstrations:
- New permission examples to demonstrate
- UI/UX improvements
- Documentation enhancements
- Additional test scenarios

Please open an issue first to discuss major changes.

### Pull Requests

1. **Fork the repository** and create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following these guidelines:
   - Keep code clean and well-commented
   - Follow existing code style
   - Focus on educational value
   - Test thoroughly in Chrome

3. **Commit your changes** with clear messages
   ```bash
   git commit -m "Add feature: description of changes"
   ```

4. **Push to your fork** and submit a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Describe your changes** in the PR:
   - What problem does it solve?
   - What does it demonstrate?
   - How has it been tested?

## Development Guidelines

### Code Style
- Use clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Use consistent indentation (2 spaces)

### Testing
Before submitting, test:
- ✅ Extension loads without errors
- ✅ All features work as expected
- ✅ No console errors
- ✅ Works with `sample_page.html`
- ✅ Permissions are appropriate for new features

### Documentation
- Update README.md for new features
- Add comments to complex code
- Include usage examples
- Update SECURITY.md if adding new permissions

## Project Structure

```
├── src/
│   ├── manifest.json         # Extension configuration
│   ├── popup.html           # Extension popup UI
│   ├── popup.js             # Popup logic and UI handlers
│   ├── background.js        # Background service worker
│   ├── content-monitor.js   # Content script for page monitoring
│   ├── sample_page.html     # Test page for demonstrations
│   └── images/              # Icons and screenshots
├── .github/                 # Issue templates
├── LICENSE                  # MIT License
├── SECURITY.md              # Security Policy
├── CONTRIBUTING.md          # Contribution Guidelines
└── README.md                # Project documentation
```

## Review Process

1. Pull requests will be reviewed for:
   - Code quality and clarity
   - Educational value
   - Security implications
   - Documentation completeness

2. Feedback will be provided within a few days
3. Changes may be requested before merging
4. Once approved, your contribution will be merged!

## Questions?

Feel free to open an issue for questions about:
- How to implement a feature
- Extension architecture
- Chrome extension APIs
- Project direction

## Recognition

Contributors will be recognized in the project. Thank you for helping make security education more accessible! 🙏

---

*Remember: This is an educational project designed to raise awareness about browser extension security risks.*
