const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("lengthRange");
const lengthDisplay = document.getElementById("lengthValue");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generateBtn");
const copyButton = document.getElementById("copy");
const strengthBar = document.querySelector(".strenght-bar");
const strengthLabel = document.getElementById("strenghtValue");

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", generatePassword);

function generatePassword() {
    let characters = "";

    if (uppercaseCheckbox.checked) characters += uppercaseLetters;
    if (lowercaseCheckbox.checked) characters += lowercaseLetters;
    if (numbersCheckbox.checked) characters += numberCharacters;
    if (symbolsCheckbox.checked) characters += symbolCharacters;

    if (!characters) {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";

    for (let index = 0; index < Number(lengthSlider.value); index += 1) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    passwordInput.value = password;
    updateStrength(password);
}

function updateStrength(password) {
    let score = Math.min(password.length * 4, 40);

    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    score = Math.min(score, 100);
    strengthBar.style.width = `${score}%`;

    if (score < 40) {
        strengthLabel.textContent = "Weak";
        strengthBar.style.backgroundColor = "#dc2626";
    } else if (score < 70) {
        strengthLabel.textContent = "Medium";
        strengthBar.style.backgroundColor = "#f59e0b";
    } else {
        strengthLabel.textContent = "Strong";
        strengthBar.style.backgroundColor = "#16a34a";
    }
}

copyButton.addEventListener("click", async () => {
    if (!passwordInput.value) return;

    try {
        await navigator.clipboard.writeText(passwordInput.value);
        copyButton.className = "fa-solid fa-check";

        setTimeout(() => {
            copyButton.className = "fa-regular fa-copy";
        }, 1200);
    } catch {
        alert("Unable to copy the password. Please copy it manually.");
    }
});

generatePassword();
