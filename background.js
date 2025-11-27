chrome.runtime.onInstalled.addListener(() => {
  console.log("StalkMe Extension installed");
});

// Store captured form data
let capturedFormData = [];

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[StalkMe Background] Received message:', message.type, 'from', sender.tab?.url);

  if (message.type === 'FORM_DATA_CAPTURED') {
    // Add tab info to the data
    const dataWithTab = {
      ...message.data,
      tabId: sender.tab?.id,
      tabTitle: sender.tab?.title
    };

    capturedFormData.push(dataWithTab);

    // Keep only last 50 entries to avoid memory issues
    if (capturedFormData.length > 50) {
      capturedFormData = capturedFormData.slice(-50);
    }

    console.log('[StalkMe Background] Stored form data. Total items:', capturedFormData.length);
    sendResponse({ success: true });
  } else if (message.type === 'GET_CAPTURED_DATA') {
    // Popup requesting captured data
    console.log('[StalkMe Background] Sending', capturedFormData.length, 'items to popup');
    sendResponse({ data: capturedFormData });
  } else if (message.type === 'CLEAR_CAPTURED_DATA') {
    // Clear stored data
    capturedFormData = [];
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});
