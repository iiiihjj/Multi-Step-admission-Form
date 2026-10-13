
const form = document.getElementById("multiStepForm");
const steps = document.querySelectorAll(".form-step");
const stepNumbers = document.querySelectorAll(".step-number");

const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

const summary = document.getElementById("summary");
const successMessage = document.getElementById("successMessage");
const navigationButtons = document.getElementById("navigationButtons");

const storageKey = "multiStepFormData";

let currentStep = 0;

// Save form data automatically
function saveProgress() {
    const formData = {};

    form.querySelectorAll("input").forEach((input) => {
        formData[input.name] = input.value;
    });

    localStorage.setItem(storageKey, JSON.stringify(formData));
}

// Restore previously saved form data
function loadProgress() {
    const savedData = localStorage.getItem(storageKey);

    if (!savedData) return;

    try {
        const formData = JSON.parse(savedData);

        form.querySelectorAll("input").forEach((input) => {
            if (typeof formData[input.name] === "string") {
                input.value = formData[input.name];
            }
        });
    } catch (error) {
        localStorage.removeItem(storageKey);
    }
}

// Save data whenever a user types
form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", saveProgress);
});

// Validate the current step
function validateStep() {
    const currentInputs = steps[currentStep].querySelectorAll("input");

    for (const input of currentInputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            input.focus();
            return false;
        }
    }

    return true;
}

// Display the selected step
function showStep(stepIndex) {
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === stepIndex);
    });

    stepNumbers.forEach((number, index) => {
        number.classList.toggle("active", index <= stepIndex);
    });

    progressBar.style.width =
        `${((stepIndex + 1) / steps.length) * 100}%`;

    prevBtn.hidden = stepIndex === 0;
    nextBtn.hidden = stepIndex === steps.length - 1;
    submitBtn.hidden = stepIndex !== steps.length - 1;

    currentStep = stepIndex;

    // Show the summary on the final step
    if (currentStep === steps.length - 1) {
        updateSummary();
    }
}

// Move to the next step
nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
    }
});

// Move to the previous step
prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
});

// Display entered information for review
function updateSummary() {
    const formData = new FormData(form);
    summary.replaceChildren();

    const fields = [
        ["Full Name", "name"],
        ["Email Address", "email"],
        ["Phone Number", "phone"],
        ["City", "city"],
        ["Country", "country"],
        ["Occupation", "occupation"]
    ];

    fields.forEach(([label, name]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        paragraph.appendChild(strong);
        paragraph.appendChild(
            document.createTextNode(formData.get(name) || "")
        );

        summary.appendChild(paragraph);
    });
}

// Submit the form
form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateStep()) return;

    updateSummary();

    successMessage.hidden = false;
    navigationButtons.hidden = true;
    progressBar.style.width = "100%";

    stepNumbers.forEach((number) => {
        number.classList.add("active");
    });

    steps.forEach((step) => {
        step.classList.remove("active");
    });

    // Clear saved data after successful submission
    localStorage.removeItem(storageKey);
});

// Restore saved data when the page opens
loadProgress();

// Display the first step
showStep(0);
