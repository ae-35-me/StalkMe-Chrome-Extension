chrome.runtime.onInstalled.addListener(() => {
  console.log("StalkMe Extension installed");
});

// Store captured form data
let capturedFormData = [];

// Store captured network traffic
let capturedNetworkTraffic = [];

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
  } else if (message.type === 'GET_NETWORK_TRAFFIC') {
    // Popup requesting network traffic
    console.log('[StalkMe Background] Sending', capturedNetworkTraffic.length, 'network requests to popup');
    sendResponse({ data: capturedNetworkTraffic });
  } else if (message.type === 'CLEAR_CAPTURED_DATA') {
    // Clear stored data
    capturedFormData = [];
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});

// Monitor network requests - capture request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    // Skip extension's own requests
    if (details.url.startsWith('chrome-extension://')) return;

    const requestData = {
      id: details.requestId,
      url: details.url,
      method: details.method,
      type: details.type,
      timestamp: new Date(details.timeStamp).toISOString(),
      requestHeaders: details.requestHeaders || [],
      tabId: details.tabId
    };

    // Extract sensitive headers
    requestData.sensitiveHeaders = extractSensitiveHeaders(details.requestHeaders);

    capturedNetworkTraffic.push(requestData);

    // Keep only last 50 entries
    if (capturedNetworkTraffic.length > 50) {
      capturedNetworkTraffic = capturedNetworkTraffic.slice(-50);
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders", "extraHeaders"]
);

// Monitor network responses - capture response headers
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    // Skip extension's own requests
    if (details.url.startsWith('chrome-extension://')) return;

    // Find the matching request
    const request = capturedNetworkTraffic.find(r => r.id === details.requestId);
    if (request) {
      request.responseHeaders = details.responseHeaders || [];
      request.statusCode = details.statusCode;
      request.sensitiveResponseHeaders = extractSensitiveResponseHeaders(details.responseHeaders);
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders", "extraHeaders"]
);

// Helper function to extract sensitive request headers
function extractSensitiveHeaders(headers) {
  if (!headers) return [];

  const sensitive = [];
  const sensitiveNames = ['authorization', 'cookie', 'x-api-key', 'x-auth-token', 'x-access-token'];

  headers.forEach(header => {
    if (sensitiveNames.includes(header.name.toLowerCase())) {
      sensitive.push({ name: header.name, value: header.value });
    }
  });

  return sensitive;
}

// Helper function to extract sensitive response headers
function extractSensitiveResponseHeaders(headers) {
  if (!headers) return [];

  const sensitive = [];
  const sensitiveNames = ['set-cookie', 'www-authenticate', 'authorization'];

  headers.forEach(header => {
    if (sensitiveNames.includes(header.name.toLowerCase())) {
      sensitive.push({ name: header.name, value: header.value });
    }
  });

  return sensitive;
}
