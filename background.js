chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

async function checkAI() {
  const ai = self.ai;
  if (!ai || !ai.languageModel) {
    return { available: false, error: 'AI API not found in background.' };
  }

  try {
    const capabilities = await ai.languageModel.capabilities();
    return {
      available: capabilities.available !== 'no',
      status: capabilities.available
    };
  } catch (e) {
    return { available: false, error: e.message };
  }
}

async function analyzeTabs(prompt) {
  try {
    const ai = self.ai;
    if (!ai || !ai.languageModel) {
      return { success: false, error: 'AI API lost in background.' };
    }

    const session = await ai.languageModel.create();
    const response = await session.prompt(prompt);
    return { success: true, text: response };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
