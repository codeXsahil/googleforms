// Function to normalize question text for case-insensitive matching
function normalizeQuestionText(questionText) {
  return questionText ? questionText.toLowerCase().trim() : "";
}

// Function to extract Google Form data
function extractGoogleFormData() {
  console.log("Extracting data from the Google Form...");

  // Select all containers for questions
  const questionContainers = document.querySelectorAll(".geS5n");
  console.log(`Found ${questionContainers.length} question containers.`);

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
        const normalizedQuestion = normalizeQuestionText(question);

        console.log(`Normalized Question: "${normalizedQuestion}"`);

        // Handle MCQ (Multiple Choice) questions
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
        // Handle Checkbox questions
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
      (stored) =>
        normalizeQuestionText(stored.question) ===
        normalizeQuestionText(newData.question)
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

// Function to handle autofilling, with consideration for multiple name fields
function autofillGoogleForm() {
  console.log("Starting autofill process...");

  const formData = JSON.parse(localStorage.getItem("googleFormData"));
  if (!formData) {
    console.error("No data found in localStorage. Please extract data first.");
    return;
  }

  const questionContainers = document.querySelectorAll(".geS5n");
  console.log(
    `Found ${questionContainers.length} question containers to autofill.`
  );

  questionContainers.forEach((container, index) => {
    try {
      const questionElement = container.querySelector(".HoXoMd .M7eMe");
      const question = questionElement
        ? questionElement.textContent.trim()
        : null;
      const normalizedQuestion = normalizeQuestionText(question);

      console.log(`Matching question: "${normalizedQuestion}"`);

      const matchingData = formData.find(
        (data) => normalizeQuestionText(data.question) === normalizedQuestion
      );

      if (matchingData) {
        console.log(
          `Autofilling data for question #${index + 1}: ${
            matchingData.question
          }`
        );

        // Special handling for name-related fields (case-insensitive)
        if (normalizedQuestion.includes("name")) {
          console.log(
            `Detected name-related field. Autofilling name as: ${matchingData.answer}`
          );
          autofillNameField(container, matchingData.answer);
        } else {
          // Autofill for other types of questions
          autofillOtherFields(container, matchingData);
        }
      }
    } catch (error) {
      console.error("Error autofilling container:", error);
    }
  });

  console.log("Autofill complete!");
}

// Function to autofill name-related fields
function autofillNameField(container, name) {
  const inputElement = container.querySelector(".whsOnd");
  if (inputElement && name && name !== "not marked") {
    inputElement.value = name;
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    console.log(`Autofilled name with: ${name}`);
  } else {
    console.log(
      "Skipping name field as it is empty or marked as 'not marked'."
    );
  }
}

// Function to autofill other types of fields (MCQs, Checkboxes, etc.)
function autofillOtherFields(container, matchingData) {
  const mcqContainer = container.querySelector('[role="radiogroup"]');
  if (mcqContainer && matchingData.answer) {
    const optionElements = mcqContainer.querySelectorAll('[role="radio"]');
    optionElements.forEach((option) => {
      const optionLabel = option.querySelector("span")
        ? option.querySelector("span").textContent.trim()
        : null;
      if (optionLabel === matchingData.answer) {
        console.log(`Autofilling MCQ answer: ${matchingData.answer}`);
        option.click();
      }
    });
  }

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
          console.log(`Autofilling Checkbox answer: ${answer}`);
          checkbox.click();
        }
      });
    });
  }

  const inputElement = container.querySelector(".whsOnd");
  if (
    inputElement &&
    matchingData.answer &&
    matchingData.answer !== "not marked"
  ) {
    inputElement.value = matchingData.answer;
    inputElement.dispatchEvent(new Event("input", { bubbles: true })); // Trigger input event
    console.log(`Autofilled Text Input with answer: ${matchingData.answer}`);
  } else if (
    inputElement &&
    (!matchingData.answer || matchingData.answer === "not marked")
  ) {
    console.log(
      `Skipping autofill for empty or "not marked" field: ${matchingData.question}`
    );
  }
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
