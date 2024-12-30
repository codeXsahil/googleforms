// Function to extract Google Form data

// function extractGoogleFormData() {
//   // Select all containers for questions
//   const questionContainers = document.querySelectorAll(".geS5n");

//   // Prepare an array to store question-answer pairs
//   const FormData = [];

//   questionContainers.forEach((container) => {
//     try {
//       // Extract the question text
//       const questionElement = container.querySelector(".HoXoMd .M7eMe");
//       const question = questionElement
//         ? questionElement.textContent.trim()
//         : null;

//       if (question) {
//         // Check if it's an MCQ
//         const mcqContainer = container.querySelector('[role="radiogroup"]');
//         if (mcqContainer) {
//           const options = [];
//           const optionElements =
//             mcqContainer.querySelectorAll('[role="radio"]');
//           optionElements.forEach((option) => {
//             const optionText = option.querySelector("span")
//               ? option.querySelector("span").textContent.trim()
//               : null;
//             options.push(optionText);
//           });

//           // Find the selected option
//           const selectedOption = mcqContainer.querySelector(
//             '[aria-checked="true"]'
//           );
//           const answer = selectedOption
//             ? selectedOption.getAttribute("aria-label")
//             : "not marked";

//           // Store the MCQ question-answer pair
//           formData.push({ question, answer, options });
//         }
//         // Check if it's a checkbox question
//         else {
//           const checkboxContainer = container.querySelector('[role="list"]');
//           if (checkboxContainer) {
//             const checkboxAnswers = [];
//             const checkboxItems =
//               checkboxContainer.querySelectorAll('[role="listitem"]');
//             checkboxItems.forEach((item) => {
//               const checkbox = item.querySelector('[role="checkbox"]');
//               if (
//                 checkbox &&
//                 checkbox.getAttribute("aria-checked") === "true"
//               ) {
//                 const checkboxLabel = item.querySelector("span");
//                 if (checkboxLabel) {
//                   checkboxAnswers.push(checkboxLabel.textContent.trim());
//                 }
//               }
//             });

//             // If no checkbox answers, set answer to "not marked"
//             const answer =
//               checkboxAnswers.length > 0 ? checkboxAnswers : ["not marked"];
//             formData.push({ question, answers: answer });
//           } else {
//             // Extract the answer for regular fields
//             const inputElement = container.querySelector(".whsOnd");
//             const answer = inputElement
//               ? inputElement.getAttribute("data-initial-value")
//               : "not marked"; // If no answer, use "not marked"

//             // Store the question-answer pair
//             formData.push({ question, answer });
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error processing container:", error);
//     }
//   });

//   // Retrieve existing data from localStorage
//   const storedData = JSON.parse(localStorage.getItem("googleFormData")) || [];

//   // Append or overwrite data
//   formData.forEach((newData) => {
//     const existingIndex = storedData.findIndex(
//       (stored) => stored.question === newData.question
//     );

//     if (existingIndex !== -1) {
//       // Overwrite existing data if answer differs
//       storedData[existingIndex] = newData;
//     } else {
//       // Append new data if it's not already in localStorage
//       storedData.push(newData);
//     }
//   });

//   // Save the updated data to localStorage
//   localStorage.setItem("googleFormData", JSON.stringify(storedData));

//   console.log("Data extracted and saved:", storedData);
//   return storedData;
// }

function extractGoogleFormData() {
  // Function to extract Google Form data working best
  // Select all containers for questions
  const questionContainers = document.querySelectorAll(".geS5n");

  // Prepare an array to store question-answer pairs
  const formData = [];

  questionContainers.forEach((container) => {
    try {
      // Extract the question text
      const questionElement = container.querySelector(".HoXoMd .M7eMe");
      const question = questionElement
        ? questionElement.textContent.trim()
        : null;

      if (question) {
        // Check if it's an MCQ
        const mcqContainer = container.querySelector('[role="radiogroup"]');
        if (mcqContainer) {
          const options = [];
          const optionElements =
            mcqContainer.querySelectorAll('[role="radio"]');
          optionElements.forEach((option) => {
            const optionText = option.querySelector("span")
              ? option.querySelector("span").textContent.trim()
              : null;
            options.push(optionText);
          });

          // Find the selected option
          const selectedOption = mcqContainer.querySelector(
            '[aria-checked="true"]'
          );
          const answer = selectedOption
            ? selectedOption.getAttribute("aria-label")
            : "not marked";

          // Store the MCQ question-answer pair
          formData.push({ question, answer, options });
        }
        // Check if it's a checkbox question
        else {
          const checkboxContainer = container.querySelector('[role="list"]');
          if (checkboxContainer) {
            const checkboxAnswers = [];
            const checkboxItems =
              checkboxContainer.querySelectorAll('[role="listitem"]');
            checkboxItems.forEach((item) => {
              const checkbox = item.querySelector('[role="checkbox"]');
              if (
                checkbox &&
                checkbox.getAttribute("aria-checked") === "true"
              ) {
                const checkboxLabel = item.querySelector("span");
                if (checkboxLabel) {
                  checkboxAnswers.push(checkboxLabel.textContent.trim());
                }
              }
            });

            // If no checkbox answers, set answer to "not marked"
            const answer =
              checkboxAnswers.length > 0 ? checkboxAnswers : ["not marked"];
            formData.push({ question, answers: answer });
          } else {
            // Extract the answer for regular fields
            const inputElement = container.querySelector(".whsOnd");
            const answer = inputElement
              ? inputElement.getAttribute("data-initial-value")
              : "not marked"; // If no answer, use "not marked"

            // Store the question-answer pair
            formData.push({ question, answer });
          }
        }
      }
    } catch (error) {
      console.error("Error processing container:", error);
    }
  });

  // Retrieve existing data from localStorage
  const storedData = JSON.parse(localStorage.getItem("googleFormData")) || [];

  // Append or overwrite data
  formData.forEach((newData) => {
    const existingIndex = storedData.findIndex(
      (stored) => stored.question === newData.question
    );

    if (existingIndex !== -1) {
      // Overwrite existing data if answer differs
      storedData[existingIndex] = newData;
    } else {
      // Append new data if it's not already in localStorage
      storedData.push(newData);
    }
  });

  // Save the updated data to localStorage
  localStorage.setItem("googleFormData", JSON.stringify(storedData));

  // Log to check if data is updated correctly
  console.log("Data extracted and saved:", storedData);
  return storedData;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Extract data message received.");
    const data = extractGoogleFormData();
    // Store extracted data into localStorage
    sendResponse({
      status: "success",
      message: "Data extracted successfully!",
    });
  }

  if (request.action === "autofillData") {
    console.log("Autofill data message received.");
    autofillGoogleForm();
    sendResponse({ status: "success", message: "Autofill completed!" });
  }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Extract data message received.");
    const data = extractGoogleFormData();
    // Store extracted data into localStorage
    sendResponse({
      status: "success",
      message: "Data extracted successfully!",
    });
  }

  if (request.action === "autofillData") {
    console.log("Autofill data message received.");
    autofillGoogleForm();
    sendResponse({ status: "success", message: "Autofill completed!" });
  }
});

// Function to autofill the Google Form using data from localStorage
function autofillGoogleForm() {
  const formData = JSON.parse(localStorage.getItem("googleFormData"));

  if (!formData) {
    console.error(
      "No data found in localStorage. Make sure to extract the data first."
    );
    return;
  }

  // Query for all question containers in the form
  const questionContainers = document.querySelectorAll(".geS5n");

  // Loop through each question container
  questionContainers.forEach((container) => {
    try {
      const questionElement = container.querySelector(".HoXoMd .M7eMe");
      const question = questionElement
        ? questionElement.textContent.trim()
        : null;

      // Find matching data for the question
      const matchingData = formData.find((data) => data.question === question);

      if (matchingData) {
        // Handle MCQ (Multiple Choice) questions
        const mcqContainer = container.querySelector('[role="radiogroup"]');
        if (mcqContainer && matchingData.answer) {
          const optionElements =
            mcqContainer.querySelectorAll('[role="radio"]');
          optionElements.forEach((option) => {
            const optionLabel = option.querySelector("span")
              ? option.querySelector("span").textContent.trim()
              : null;
            if (optionLabel === matchingData.answer) {
              option.click(); // Autofill the answer
            }
          });
        }

        // Handle Checkbox questions
        const checkboxContainer = container.querySelector('[role="list"]');
        if (checkboxContainer && matchingData.answers) {
          const checkboxItems =
            checkboxContainer.querySelectorAll('[role="listitem"]');
          matchingData.answers.forEach((answer) => {
            checkboxItems.forEach((item) => {
              const checkbox = item.querySelector('[role="checkbox"]');
              const checkboxLabel = item.querySelector("span")
                ? item.querySelector("span").textContent.trim()
                : null;
              if (checkboxLabel === answer && checkbox) {
                checkbox.click(); // Autofill the checkbox answer
              }
            });
          });
        }

        // Handle Text Input (Regular Fields)
        const inputElement = container.querySelector(".whsOnd");
        if (inputElement && matchingData.answer) {
          inputElement.value = matchingData.answer;
          inputElement.dispatchEvent(new Event("input", { bubbles: true })); // Trigger input event to ensure the value is registered
        }
      }
    } catch (error) {
      console.error("Error autofilling container:", error);
    }
  });

  console.log("Autofill complete!");
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Extract data message received.");
    const data = extractGoogleFormData();
    localStorage.setItem("googleFormData", JSON.stringify(data)); // Store extracted data
    sendResponse({
      status: "success",
      message: "Data extracted successfully!",
    });
  }

  if (request.action === "autofillData") {
    console.log("Autofill data message received.");
    autofillGoogleForm();
    sendResponse({ status: "success", message: "Autofill completed!" });
  }
});
