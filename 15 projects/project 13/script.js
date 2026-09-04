// DOM Elements
const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");
const rateInfo = document.getElementById("rate-info");
const resultDiv = document.getElementById("result");

// Cache fetched exchange rates to improve performance and responsiveness
const ratesCache = {};

// Popular currencies prioritize top of list or default selection
const DEFAULT_FROM = "USD";
const DEFAULT_TO = "EUR";

// Event Listeners
window.addEventListener("DOMContentLoaded", initApp);
converterForm.addEventListener("submit", handleFormSubmit);

if (swapBtn) {
    swapBtn.addEventListener("click", swapCurrencies);
}

// Live update on input or select change
amountInput.addEventListener("input", handleLiveConvert);
fromCurrency.addEventListener("change", () => convertCurrency(false));
toCurrency.addEventListener("change", () => convertCurrency(false));

/**
 * Initialize app by populating currencies and performing initial conversion
 */
async function initApp() {
    setLoadingState(true, "Loading currency rates...");
    const success = await fetchCurrencies();
    if (success) {
        await convertCurrency(false);
    }
}

/**
 * Fetch currency list and populate both select dropdowns
 */
async function fetchCurrencies() {
    try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        ratesCache["USD"] = data.rates;

        const currencies = Object.keys(data.rates).sort();

        // Clear existing options
        fromCurrency.innerHTML = "";
        toCurrency.innerHTML = "";

        currencies.forEach(currency => {
            const option1 = document.createElement("option");
            option1.value = currency;
            option1.textContent = currency;
            if (currency === DEFAULT_FROM) option1.selected = true;
            fromCurrency.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = currency;
            option2.textContent = currency;
            if (currency === DEFAULT_TO) option2.selected = true;
            toCurrency.appendChild(option2);
        });

        return true;
    } catch (error) {
        console.error("Error loading currencies:", error);
        showError("Unable to load currency list. Please check your internet connection.");
        return false;
    }
}

/**
 * Fetch latest rates for a specific base currency (with in-memory cache)
 */
async function getRates(baseCurrency) {
    if (ratesCache[baseCurrency]) {
        return ratesCache[baseCurrency];
    }

    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch rates for ${baseCurrency}`);
    }

    const data = await res.json();
    ratesCache[baseCurrency] = data.rates;
    return data.rates;
}

/**
 * Perform currency conversion
 * @param {boolean} isManualSubmit - whether triggered by manual submit/click
 */
async function convertCurrency(isManualSubmit = true) {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amountVal = amountInput.value.trim();
    const amount = parseFloat(amountVal);

    if (!amountVal || isNaN(amount) || amount <= 0) {
        if (isManualSubmit || amountVal !== "") {
            showError("Please enter a valid amount greater than 0");
        } else {
            resultDiv.textContent = "";
            resultDiv.className = "";
            rateInfo.textContent = "";
        }
        return;
    }

    if (!from || !to) return;

    // Same currency shortcut
    if (from === to) {
        resultDiv.className = "";
        resultDiv.textContent = `${formatNumber(amount)} ${from} = ${formatNumber(amount)} ${to}`;
        rateInfo.textContent = `1 ${from} = 1.0000 ${to}`;
        return;
    }

    try {
        setLoadingState(true, "Converting...");

        const rates = await getRates(from);
        const rate = rates[to];

        if (!rate) {
            throw new Error(`Exchange rate not found for ${to}`);
        }

        const convertedAmount = (amount * rate).toFixed(2);

        // Display results cleanly
        resultDiv.className = "";
        resultDiv.textContent = `${formatNumber(amount)} ${from} = ${formatNumber(convertedAmount)} ${to}`;
        rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    } catch (error) {
        console.error("Conversion error:", error);
        showError("Failed to convert currency. Please try again.");
    } finally {
        setLoadingState(false);
    }
}

/**
 * Form submit handler
 */
function handleFormSubmit(e) {
    e.preventDefault();
    convertCurrency(true);
}

/**
 * Live conversion with slight debounce
 */
let debounceTimer;
function handleLiveConvert() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        convertCurrency(false);
    }, 250);
}

/**
 * Swap "From" and "To" currencies and immediately re-convert
 */
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // Trigger conversion with new swapped currencies
    convertCurrency(false);
}

/**
 * Format numbers with locale comma separators
 */
function formatNumber(num) {
    const parsed = Number(num);
    if (isNaN(parsed)) return num;
    return parsed.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });
}

/**
 * Display error state
 */
function showError(message) {
    resultDiv.className = "error";
    resultDiv.textContent = message;
    rateInfo.textContent = "";
    setLoadingState(false);
}

/**
 * Toggle UI loading state
 */
function setLoadingState(isLoading, message = "Loading...") {
    if (isLoading) {
        if (convertBtn) convertBtn.disabled = true;
        resultDiv.className = "loading";
        resultDiv.textContent = message;
    } else {
        if (convertBtn) convertBtn.disabled = false;
    }
}
