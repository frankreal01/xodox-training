// All 15 Available Projects in the Repository
const PROJECTS = [
    { id: 1, name: "Quiz Game", path: "../project 1/index.html", keywords: "quiz test game trivia questions" },
    { id: 2, name: "Color Palette Generator", path: "../project 2/index.html", keywords: "color palette hex generator design" },
    { id: 3, name: "Kanban Board", path: "../project 3/index.html", keywords: "kanban board task todo drag drop" },
    { id: 4, name: "Expense Tracker", path: "../project 4/index.html", keywords: "expense tracker money budget finance" },
    { id: 5, name: "Bookmark Saver", path: "../project 5/index.html", keywords: "bookmark saver links url storage" },
    { id: 6, name: "Form Validator", path: "../project 6/index.html", keywords: "form validator registration auth validation" },
    { id: 7, name: "Password Generator", path: "../project 7/index.html", keywords: "password generator security generator" },
    { id: 8, name: "Todo App", path: "../project 8/index.html", keywords: "todo app tasks list complete" },
    { id: 9, name: "Contact Form", path: "../project 9/index.html", keywords: "contact form message feedback inquiry" },
    { id: 10, name: "Pricing Cards", path: "../project 10/index.html", keywords: "pricing cards subscription plans billing table" },
    { id: 11, name: "Team Members Showcase", path: "../project 11/index.html", keywords: "team members showcase staff profiles filter" },
    { id: 12, name: "Recipe Finder", path: "../project 12/index.html", keywords: "recipe finder meals cooking ingredients api" },
    { id: 13, name: "Currency Converter", path: "../project 13/index.html", keywords: "currency converter exchange rates rates api" },
    { id: 14, name: "GitHub User Finder", path: "../project 14/index.html", keywords: "github user finder profile repos api" },
    { id: 15, name: "Newsletter UI", path: "../project 15/index.html", keywords: "newsletter subscribe email tips signup" }
];

// Fun Themed Fishing Catches
const FISHING_CATCHES = [
    "🐟 You reeled in a Code Bass! Freshly refactored and scales clean.",
    "🦀 Snapped! You hooked a Buggy Crab! Quick, patch it before it pinches.",
    "👟 Plop! An old CSS Floppy Boot surfaced from the depths of 1999.",
    "💎 Legendary! You caught a Rare Golden JavaScript Trout (+100 XP)!",
    "📜 You fished out a Message in a Bottle: '404 - Keep coding, you got this!'",
    "🦑 Whoosh! A friendly mini Squid splashed you and escaped with your bait!",
    "🐠 You caught a Neon Coral Guppy! It glowed in CSS cyan.",
    "🎣 Hooked on syntax! You caught a clean, error-free async Promise."
];

// DOM Elements
const brokenUrlEl = document.getElementById("broken-url");
const countdownTimerEl = document.getElementById("countdown-timer");
const countdownBarEl = document.getElementById("countdown-bar");
const pauseCountdownBtn = document.getElementById("pause-countdown-btn");
const randomProjectBtn = document.getElementById("random-project-btn");
const fishBtn = document.getElementById("fish-btn");
const imageWrapper = document.getElementById("image-wrapper");
const catchAlertEl = document.getElementById("catch-alert");

const projectSearchInput = document.getElementById("project-search");
const clearSearchBtn = document.getElementById("clear-search-btn");
const searchResultsEl = document.getElementById("search-results");

// Countdown state
let secondsRemaining = 10;
let isPaused = false;
let countdownInterval = null;
let catchTimeout = null;

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    initBrokenUrl();
    initCountdown();
    initFishing();
    initProjectSearch();
    initRandomProject();
});

/**
 * Display the requested URL or realistic dummy path
 */
function initBrokenUrl() {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("page") || params.get("url");

    if (target) {
        brokenUrlEl.textContent = target.startsWith("/") ? target : `/${target}`;
    } else {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf("/") + 1);
        brokenUrlEl.textContent = filename && filename !== "index.html" ? `/${filename}` : "/lost-in-the-lake";
    }
}

/**
 * Countdown timer with pause/resume functionality
 */
function initCountdown() {
    if (!countdownTimerEl || !countdownBarEl) return;

    countdownInterval = setInterval(() => {
        if (!isPaused) {
            secondsRemaining--;
            countdownTimerEl.textContent = secondsRemaining;

            if (secondsRemaining <= 0) {
                clearInterval(countdownInterval);
                window.location.href = "../../index.html";
            }
        }
    }, 1000);

    if (pauseCountdownBtn) {
        pauseCountdownBtn.addEventListener("click", toggleCountdownPause);
    }
}

function toggleCountdownPause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseCountdownBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        pauseCountdownBtn.title = "Resume auto-redirect";
    } else {
        pauseCountdownBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        pauseCountdownBtn.title = "Pause auto-redirect";
    }
}

/**
 * Random Project Redirect
 */
function initRandomProject() {
    if (!randomProjectBtn) return;

    randomProjectBtn.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * PROJECTS.length);
        const selected = PROJECTS[randomIndex];
        window.location.href = selected.path;
    });
}

/**
 * Interactive Fishing Easter Egg
 */
function initFishing() {
    if (fishBtn) {
        fishBtn.addEventListener("click", castFishingRod);
    }

    if (imageWrapper) {
        imageWrapper.addEventListener("click", castFishingRod);
    }
}

function castFishingRod() {
    // Pause redirect if user is playing
    if (!isPaused) {
        toggleCountdownPause();
    }

    const randomIndex = Math.floor(Math.random() * FISHING_CATCHES.length);
    const catchMessage = FISHING_CATCHES[randomIndex];

    clearTimeout(catchTimeout);
    catchAlertEl.textContent = catchMessage;
    catchAlertEl.classList.remove("hidden");

    // Re-trigger animation
    catchAlertEl.style.animation = "none";
    catchAlertEl.offsetHeight; // Trigger reflow
    catchAlertEl.style.animation = "slideDown 0.3s ease";

    catchTimeout = setTimeout(() => {
        catchAlertEl.classList.add("hidden");
    }, 4500);
}

/**
 * Project Search & Quick Navigation
 */
function initProjectSearch() {
    if (!projectSearchInput || !searchResultsEl) return;

    projectSearchInput.addEventListener("input", handleSearchInput);
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            projectSearchInput.value = "";
            clearSearchBtn.classList.add("hidden");
            searchResultsEl.classList.add("hidden");
            projectSearchInput.focus();
        });
    }

    // Close dropdown on click outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-section")) {
            searchResultsEl.classList.add("hidden");
        }
    });

    // Keyboard navigation in search
    projectSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            searchResultsEl.classList.add("hidden");
        }
    });
}

function handleSearchInput() {
    const query = projectSearchInput.value.trim().toLowerCase();

    if (!query) {
        if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
        searchResultsEl.classList.add("hidden");
        searchResultsEl.innerHTML = "";
        return;
    }

    if (clearSearchBtn) clearSearchBtn.classList.remove("hidden");

    const matches = PROJECTS.filter(proj => 
        proj.name.toLowerCase().includes(query) ||
        proj.keywords.toLowerCase().includes(query) ||
        proj.id.toString() === query
    );

    renderSearchResults(matches);
}

function renderSearchResults(matches) {
    searchResultsEl.innerHTML = "";

    if (matches.length === 0) {
        searchResultsEl.innerHTML = `<div class="no-results"><i class="fas fa-circle-question"></i> No projects found matching your search.</div>`;
        searchResultsEl.classList.remove("hidden");
        return;
    }

    matches.forEach(proj => {
        const item = document.createElement("a");
        item.href = proj.path;
        item.className = "search-item";
        item.innerHTML = `
            <span><i class="fas fa-folder-open" style="color: var(--accent); margin-right: 8px;"></i>${proj.name}</span>
            <span class="project-idx">Project ${proj.id}</span>
        `;
        searchResultsEl.appendChild(item);
    });

    searchResultsEl.classList.remove("hidden");
}
