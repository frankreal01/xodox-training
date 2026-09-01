const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const input = toggle.previousElementSibling;
        const isPasswordVisible = input.type === "text";

        input.type = isPasswordVisible ? "password" : "text";
        toggle.textContent = isPasswordVisible ? "Show" : "Hide";
        toggle.setAttribute("aria-pressed", String(!isPasswordVisible));
        toggle.setAttribute(
            "aria-label",
            `${isPasswordVisible ? "Show" : "Hide"} ${input.id === "password" ? "password" : "confirm password"}`
        );
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isRequiredValid = checkRequired([username, email, password, confirmPassword]);

    let isFormValid = isRequiredValid;

    if (isRequiredValid) {
        const isUsernameValid = checkLength(username, 3, 20);
        const isEmailValid = checkEmail(email);
        const isPasswordValid = checkLength(password, 6, 25);
        const isConfirmPasswordValid = checkPasswordsMatch(password, confirmPassword);

        isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }

    if (isFormValid) {
        alert("Registration successful!");
        form.reset();
        document.querySelectorAll(".form-group").forEach((group) => {
            group.className = "form-group";
        });
    }
});

function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input1, "Passwords do not match");
        showError(input2, "Passwords do not match");
        return false;
    }
    showSuccess(input2);
    return true;
}

function checkEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, "Invalid email address");
        return false;
    }
    return true;
}

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${formatFieldName(input)}Length must be at least ${min} characters`);
        return false;
    } else if (input.value.length > max) {
        showError(input, `${formatFieldName(input)}Length must be at most ${max} characters`);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

function checkRequired(inputArray) {
    let isValid = true;

    inputArray.forEach((input) => {
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false;
        } else {
            showSuccess(input);
        }
    });
    return isValid;
}

function formatFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function showError(input, message) {
    const formGroup = input.closest(".form-group");
    formGroup.className = "form-group error";
    const small = formGroup.querySelector("small");
    small.innerText = message;
}

function showSuccess(input) {
    const formGroup = input.closest(".form-group");
    formGroup.className = "form-group success";
}
