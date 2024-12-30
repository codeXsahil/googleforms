chrome.runtime.onInstalled.addListener(() => {
  console.log("Google Form Autofill extension installed.");
});

// Listen to messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request.action);
  try {
    if (request.action === "getData") {
      const formData = JSON.parse(localStorage.getItem("googleFormData")) || [];
      console.log("Retrieved data from localStorage:", formData);
      sendResponse(formData);
    }
  } catch (error) {
    console.error("Error in background script:", error);
    sendResponse([]);
  }
});
