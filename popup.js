// Extract data button click event listener
document.getElementById("extractDataBtn").addEventListener("click", () => {
  console.log("Extract Data button clicked");

  // Send message to content script to extract data
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      console.log("Sending message to content script for data extraction.");
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractData" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else {
            console.log("Data extraction successful:", response.message);
          }
        }
      );
    } else {
      console.error("No active tab or content script not available.");
    }
  });
});

// Autofill data button click event listener
document.getElementById("autofillDataBtn").addEventListener("click", () => {
  console.log("Autofill Data button clicked");

  // Send message to content script to autofill data
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      console.log("Sending message to content script for autofill.");
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "autofillData" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else {
            console.log("Autofill successful:", response.message);
          }
        }
      );
    } else {
      console.error("No active tab or content script not available.");
    }
  });
});
