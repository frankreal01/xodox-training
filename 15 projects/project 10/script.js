// Pricing Cards Interactive Script
document.addEventListener("DOMContentLoaded", () => {
    // Pricing data configuration
    const pricingData = {
        basic: {
            name: "Basic Plan",
            monthlyRate: 15,
            annualRate: 12,
            annualBilled: 144,
            description: "Perfect for individuals and small projects"
        },
        pro: {
            name: "Pro Plan",
            monthlyRate: 30,
            annualRate: 24,
            annualBilled: 288,
            description: "Great for growing businesses and teams"
        },
        premium: {
            name: "Premium Plan",
            monthlyRate: 60,
            annualRate: 48,
            annualBilled: 576,
            description: "For large companies and organizations"
        }
    };

    // DOM Elements
    const billingToggle = document.getElementById("billing-toggle");
    const monthlyLabel = document.getElementById("monthly-label");
    const yearlyLabel = document.getElementById("yearly-label");
    const cards = document.querySelectorAll(".pricing-cards .card");

    // Modal Elements
    const modalOverlay = document.getElementById("checkout-modal");
    const modalClose = document.getElementById("modal-close");
    const modalCancel = document.getElementById("modal-cancel");
    const modalConfirm = document.getElementById("modal-confirm");
    const modalBadge = document.getElementById("modal-badge");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalBilling = document.getElementById("modal-billing");
    const modalRate = document.getElementById("modal-rate");
    const modalDiscount = document.getElementById("modal-discount");
    const modalTotal = document.getElementById("modal-total");

    // Toast Element
    const toast = document.getElementById("toast");
    let toastTimeout = null;

    // State
    let isAnnual = false;
    let selectedPlanKey = "pro";

    // Initialize UI
    updatePricingDisplay();

    // Event: Toggle Switch
    if (billingToggle) {
        billingToggle.addEventListener("click", () => {
            isAnnual = !isAnnual;
            billingToggle.classList.toggle("active", isAnnual);
            billingToggle.setAttribute("aria-checked", isAnnual ? "true" : "false");

            monthlyLabel.classList.toggle("active", !isAnnual);
            yearlyLabel.classList.toggle("active", isAnnual);

            updatePricingDisplay();
            showToast(isAnnual ? "Switched to Annual billing (20% discount applied)!" : "Switched to Monthly billing.");
        });
    }

    // Event: Clicking on labels to toggle
    if (monthlyLabel) {
        monthlyLabel.addEventListener("click", () => {
            if (isAnnual) billingToggle.click();
        });
    }
    if (yearlyLabel) {
        yearlyLabel.addEventListener("click", () => {
            if (!isAnnual) billingToggle.click();
        });
    }

    // Function: Animate Number Change
    function animateValue(element, start, end, duration = 300) {
        if (start === end) {
            element.textContent = end;
            return;
        }
        const range = end - start;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * ease);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        }
        requestAnimationFrame(step);
    }

    // Function: Update Prices on Cards
    function updatePricingDisplay() {
        cards.forEach((card) => {
            const planKey = card.getAttribute("data-plan");
            const data = pricingData[planKey];
            if (!data) return;

            const amountEl = card.querySelector(".amount");
            const periodEl = card.querySelector(".period");
            let noteEl = card.querySelector(".annual-note");

            const currentVal = parseInt(amountEl.textContent, 10) || data.monthlyRate;
            const targetVal = isAnnual ? data.annualRate : data.monthlyRate;

            animateValue(amountEl, currentVal, targetVal);

            if (isAnnual) {
                periodEl.textContent = "/month";
                if (!noteEl) {
                    noteEl = document.createElement("div");
                    noteEl.className = "annual-note";
                    card.querySelector(".price").insertAdjacentElement("afterend", noteEl);
                }
                noteEl.textContent = `$${data.annualBilled} billed annually`;
                noteEl.style.display = "block";
            } else {
                periodEl.textContent = "/month";
                if (noteEl) {
                    noteEl.style.display = "none";
                }
            }
        });
    }

    // Card Selection and Action
    cards.forEach((card, index) => {
        // Allow clicking card to select
        card.addEventListener("click", (e) => {
            // Don't duplicate if clicking the button itself
            if (!e.target.closest("button")) {
                selectCard(card);
            }
        });

        // Button Click
        const btn = card.querySelector(".btn");
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                selectCard(card);
                openModal(card.getAttribute("data-plan"));
            });
        }

        // Accessibility keyboard support
        card.setAttribute("tabindex", "0");
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectCard(card);
                openModal(card.getAttribute("data-plan"));
            } else if (e.key === "ArrowRight") {
                const next = cards[index + 1] || cards[0];
                next.focus();
            } else if (e.key === "ArrowLeft") {
                const prev = cards[index - 1] || cards[cards.length - 1];
                prev.focus();
            }
        });
    });

    function selectCard(selectedCard) {
        cards.forEach((c) => c.classList.remove("selected"));
        selectedCard.classList.add("selected");
        selectedPlanKey = selectedCard.getAttribute("data-plan") || "pro";
    }

    // Modal Handling
    function openModal(planKey) {
        const data = pricingData[planKey] || pricingData.pro;
        selectedPlanKey = planKey;

        modalBadge.textContent = data.name;
        modalTitle.textContent = `Confirm ${data.name}`;
        modalDesc.textContent = data.description;

        if (isAnnual) {
            modalBilling.textContent = "Annual (12 Months)";
            modalRate.textContent = `$${data.annualRate} / month`;
            modalDiscount.textContent = "20% OFF applied";
            modalTotal.textContent = `$${data.annualBilled}.00 USD`;
        } else {
            modalBilling.textContent = "Monthly";
            modalRate.textContent = `$${data.monthlyRate} / month`;
            modalDiscount.textContent = "None";
            modalTotal.textContent = `$${data.monthlyRate}.00 USD`;
        }

        modalOverlay.classList.add("active");
        modalClose.focus();
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalCancel) modalCancel.addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
            closeModal();
        }
    });

    if (modalConfirm) {
        modalConfirm.addEventListener("click", () => {
            const data = pricingData[selectedPlanKey];
            closeModal();
            showToast(`🎉 Success! Proceeding with ${data.name} (${isAnnual ? "Annual" : "Monthly"}).`);
        });
    }

    // Toast Function
    function showToast(message) {
        if (!toast) return;
        toast.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;"></i><span>${message}</span>`;
        toast.classList.add("show");

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }
});
