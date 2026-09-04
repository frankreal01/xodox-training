// DOM Elements
const newsletterForm = document.getElementById("newsletter-form");
const emailInput = document.getElementById("email");
const statusMessage = document.getElementById("status-message");
const subscribeBtn = document.getElementById("subscribe-btn");
const btnText = document.getElementById("btn-text");
const btnIcon = document.getElementById("btn-icon");

const formContent = document.getElementById("form-content");
const successView = document.getElementById("success-view");
const subscribedEmailDisplay = document.getElementById("subscribed-email-display");
const subscriberCountEl = document.getElementById("subscriber-count");
const anotherBtn = document.getElementById("another-btn");
const unsubscribeBtn = document.getElementById("unsubscribe-btn");

// Storage & Initial State
const STORAGE_KEY = "newsletter_subscribers";
const BASE_SUBSCRIBERS = 4820;
let currentSubscribedEmail = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    updateSubscriberBadge();
    setupEventListeners();
});

function setupEventListeners() {
    newsletterForm.addEventListener("submit", handleSubscribe);
    
    // Live validation on typing
    emailInput.addEventListener("input", () => {
        if (statusMessage.classList.contains("visible")) {
            hideStatus();
        }
    });

    if (anotherBtn) {
        anotherBtn.addEventListener("click", resetToForm);
    }

    if (unsubscribeBtn) {
        unsubscribeBtn.addEventListener("click", handleUnsubscribe);
    }
}

/**
 * Handle subscription form submission
 */
async function handleSubscribe(e) {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();

    // Validate email
    if (!email) {
        showStatus("Please enter your email address.", "error");
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showStatus("Please enter a valid email address (e.g. name@domain.com).", "error");
        emailInput.focus();
        return;
    }

    // Check duplicate
    const subscribers = getStoredSubscribers();
    const isAlreadySubscribed = subscribers.some(sub => sub.email === email);

    if (isAlreadySubscribed) {
        showStatus("This email is already on our newsletter list!", "error");
        emailInput.focus();
        return;
    }

    // Process subscription via mock API
    try {
        setLoading(true);
        hideStatus();

        // Simulate async network request / newsletter API endpoint
        await mockSubscribeApi(email);

        // Save subscriber
        subscribers.push({
            email: email,
            subscribedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));

        currentSubscribedEmail = email;
        updateSubscriberBadge();
        showSuccessView(email);
    } catch (err) {
        console.error("Subscription error:", err);
        showStatus(err.message || "Something went wrong. Please try again.", "error");
    } finally {
        setLoading(false);
    }
}

/**
 * Simulated Asynchronous Newsletter API Service
 */
function mockSubscribeApi(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Emulate rare edge case / blacklisted test domains if needed
            if (email.endsWith("@testfail.com")) {
                reject(new Error("Unable to deliver to this domain. Please use a valid email."));
            } else {
                resolve({
                    status: 200,
                    success: true,
                    message: "Subscription successful"
                });
            }
        }, 650);
    });
}

/**
 * Handle unsubscribe action from confirmation card
 */
function handleUnsubscribe() {
    if (!currentSubscribedEmail) return;

    let subscribers = getStoredSubscribers();
    subscribers = subscribers.filter(sub => sub.email !== currentSubscribedEmail);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));

    updateSubscriberBadge();
    resetToForm();
    showStatus(`Successfully unsubscribed ${currentSubscribedEmail}.`, "success");
    currentSubscribedEmail = "";
}

/**
 * Email syntax validation using RFC-compliant pattern
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
}

/**
 * Retrieve subscribers array from localStorage
 */
function getStoredSubscribers() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Error reading localStorage:", e);
        return [];
    }
}

/**
 * Refresh community subscriber count badge
 */
function updateSubscriberBadge() {
    const subscribers = getStoredSubscribers();
    const totalCount = BASE_SUBSCRIBERS + subscribers.length;
    if (subscriberCountEl) {
        subscriberCountEl.textContent = totalCount.toLocaleString();
    }
}

/**
 * Switch from form to success confirmation card
 */
function showSuccessView(email) {
    formContent.classList.add("hidden");
    successView.classList.remove("hidden");
    subscribedEmailDisplay.textContent = email;
}

/**
 * Reset back to subscription form view
 */
function resetToForm() {
    successView.classList.add("hidden");
    formContent.classList.remove("hidden");
    emailInput.value = "";
    hideStatus();
    emailInput.focus();
}

/**
 * Toggle button loading spinner
 */
function setLoading(isLoading) {
    if (isLoading) {
        subscribeBtn.disabled = true;
        btnText.textContent = "Subscribing...";
        btnIcon.className = "fas fa-spinner fa-spin";
    } else {
        subscribeBtn.disabled = false;
        btnText.textContent = "Subscribe";
        btnIcon.className = "fas fa-arrow-right";
    }
}

/**
 * Show status alert banner
 */
function showStatus(message, type = "error") {
    statusMessage.textContent = message;
    statusMessage.className = `status-message visible ${type}`;
}

/**
 * Hide status alert banner
 */
function hideStatus() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}
