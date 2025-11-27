# StalkMe Chrome Extension 🕵️‍♂️

**StalkMe** is a demonstration Chrome Extension designed to highlight privacy risks and showcase the capabilities of Chrome's built-in AI (Gemini Nano).

## Features

*   **🍪 Cookie Collection**: Displays all cookies for the current site and highlights potential **Session Tokens** in red.
*   **🤖 AI Surveillance**: Uses Chrome's experimental **Built-in AI (Gemini Nano)** to analyze your open tabs and generate a "creepy" summary of your online personality.
*   **🔒 Privacy First**: All analysis happens **locally** on your device using the built-in model. No data is sent to external servers (unless you explicitly configured the legacy API fallback).

## Installation

1.  Clone this repository.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable **Developer Mode** (top right).
4.  Click **Load unpacked**.
5.  Select the directory containing this extension.

## Enabling Built-in AI

To use the AI features, you must enable Chrome's experimental AI flags:

1.  Go to `chrome://flags`.
2.  Enable **"Prompt API for Gemini Nano"**.
3.  Enable **"Enables optimization guide on device"** (select "Enabled BypassPerfRequirement").
4.  Relaunch Chrome.
5.  Go to `chrome://components` and ensure **"Optimization Guide On Device Model"** is downloaded.

## Disclaimer

This extension is for **educational and demonstration purposes only**. It requests extensive permissions (`webRequest`, `cookies`, `tabs`) to demonstrate how much data an extension can access. Use with caution.
