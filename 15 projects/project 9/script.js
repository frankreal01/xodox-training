"use strict";

const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");
const submitButton = form?.querySelector('button[type="submit"]');
const buttonText = submitButton?.querySelector("span");

const requiredFields = form ? [...form.querySelectorAll("[required]")] : [];

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `form-status ${type}`;
}

function validateField(field) {
    const value = field.value.trim();
    let message = "";

    if (!value) {
        message = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required.`;
    } else if (field.type === "email" && !field.validity.valid) {
        message = "Please enter a valid email address.";
    }

    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", Boolean(message));
    field.setCustomValidity(message);
    return message;
}

requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
        validateField(field);
        if (statusMessage.classList.contains("error")) showStatus("", "");
    });

    field.addEventListener("blur", () => validateField(field));
});

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstError = requiredFields.map(validateField).find(Boolean);
    if (firstError) {
        showStatus(firstError, "error");
        form.querySelector(".is-invalid")?.focus();
        return;
    }

    submitButton.disabled = true;
    buttonText.textContent = "Sending...";
    showStatus("", "");

    // Replace this short delay with a fetch() request when a form endpoint is available.
    window.setTimeout(() => {
        form.reset();
        requiredFields.forEach((field) => {
            field.classList.remove("is-invalid");
            field.setAttribute("aria-invalid", "false");
        });
        submitButton.disabled = false;
        buttonText.textContent = "Send Message";
        showStatus("Thanks! Your message has been sent successfully.", "success");
    }, 700);
});
