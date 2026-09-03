// Team Members Showcase Interactive Script
document.addEventListener("DOMContentLoaded", () => {
    // Open Jobs Data
    const openPositions = [
        {
            title: "Senior Full-Stack Engineer",
            dept: "Engineering",
            type: "Full-Time",
            location: "Remote",
            desc: "Lead web architecture, build responsive frontend UI, and scale APIs."
        },
        {
            title: "Senior UI/UX Designer",
            dept: "Design",
            type: "Full-Time",
            location: "Hybrid",
            desc: "Create beautiful design systems, user journeys, and interactive prototypes."
        },
        {
            title: "Growth Marketing Specialist",
            dept: "Marketing",
            type: "Full-Time",
            location: "Remote",
            desc: "Drive digital acquisition campaigns, brand awareness, and performance metrics."
        },
        {
            title: "Customer Success Specialist",
            dept: "Support",
            type: "Full-Time",
            location: "On-Site",
            desc: "Partner with enterprise clients to deliver onboarding and first-class support."
        }
    ];

    // DOM Elements
    const searchInput = document.getElementById("member-search");
    const clearSearchBtn = document.getElementById("clear-search");
    const filterTabs = document.querySelectorAll(".filter-tab");
    const cards = document.querySelectorAll(".team-grid .team-card");
    const noResults = document.getElementById("no-results");
    const resetFiltersBtn = document.getElementById("reset-filters-btn");

    // Member Modal Elements
    const memberModal = document.getElementById("member-modal");
    const memberModalClose = document.getElementById("member-modal-close");
    const modalMemberImg = document.getElementById("modal-member-img");
    const modalMemberName = document.getElementById("modal-member-name");
    const modalMemberRole = document.getElementById("modal-member-role");
    const modalMemberDept = document.getElementById("modal-member-dept");
    const modalMemberBio = document.getElementById("modal-member-bio");
    const modalMemberEmail = document.getElementById("modal-member-email");
    const copyEmailBtn = document.getElementById("copy-email-btn");

    // Positions Modal Elements
    const openPositionsBtn = document.getElementById("open-positions-btn");
    const positionsModal = document.getElementById("positions-modal");
    const positionsModalClose = document.getElementById("positions-modal-close");
    const jobsList = document.getElementById("jobs-list");

    // Toast
    const toast = document.getElementById("toast");
    let toastTimeout = null;

    // Current State
    let currentFilter = "all";
    let searchQuery = "";
    let currentEmail = "";

    // Initialize Jobs List in Modal
    if (jobsList) {
        jobsList.innerHTML = openPositions.map((job) => `
            <div class="job-item">
                <div class="job-info">
                    <h4>${job.title}</h4>
                    <div class="job-meta">
                        <span class="job-badge">${job.dept}</span>
                        <span><i class="fas fa-clock"></i> ${job.type}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    </div>
                    <p style="font-size:0.85rem; color:var(--text-gray); margin-top:6px;">${job.desc}</p>
                </div>
                <button class="apply-btn" data-title="${job.title}">Apply Now</button>
            </div>
        `).join("");

        // Handle Apply Clicks
        jobsList.querySelectorAll(".apply-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const title = btn.getAttribute("data-title");
                btn.textContent = "Applied ✓";
                btn.style.background = "#10b981";
                btn.disabled = true;
                showToast(`🎉 Application submitted for ${title}! We will be in touch.`);
            });
        });
    }

    // Filter Logic
    function filterCards() {
        let visibleCount = 0;

        cards.forEach((card) => {
            const dept = card.getAttribute("data-department") || "";
            const name = (card.getAttribute("data-name") || "").toLowerCase();
            const role = (card.getAttribute("data-role") || "").toLowerCase();
            const bio = (card.querySelector(".bio")?.textContent || "").toLowerCase();

            const matchesDept = currentFilter === "all" || dept.toLowerCase() === currentFilter.toLowerCase();
            const matchesSearch = !searchQuery ||
                name.includes(searchQuery) ||
                role.includes(searchQuery) ||
                bio.includes(searchQuery) ||
                dept.toLowerCase().includes(searchQuery);

            if (matchesDept && matchesSearch) {
                card.classList.remove("hidden");
                card.classList.add("fade-in");
                visibleCount++;
            } else {
                card.classList.add("hidden");
                card.classList.remove("fade-in");
            }
        });

        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove("hidden");
            } else {
                noResults.classList.add("hidden");
            }
        }
    }

    // Filter Tabs Click
    filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            filterTabs.forEach((t) => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            currentFilter = tab.getAttribute("data-filter") || "all";
            filterCards();
        });
    });

    // Search Input Handling
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            if (clearSearchBtn) {
                clearSearchBtn.classList.toggle("hidden", !searchQuery);
            }
            filterCards();
        });
    }

    // Clear Search Button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            searchInput.value = "";
            searchQuery = "";
            clearSearchBtn.classList.add("hidden");
            searchInput.focus();
            filterCards();
        });
    }

    // Reset Filters Button in No Results Box
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                searchQuery = "";
            }
            if (clearSearchBtn) {
                clearSearchBtn.classList.add("hidden");
            }
            const allTab = document.querySelector('.filter-tab[data-filter="all"]');
            if (allTab) {
                allTab.click();
            } else {
                currentFilter = "all";
                filterCards();
            }
        });
    }

    // Card Details Modal
    cards.forEach((card) => {
        // Clicking card opens modal (unless clicking social icon)
        card.addEventListener("click", (e) => {
            if (e.target.closest(".social-icon")) return;

            const name = card.getAttribute("data-name") || card.querySelector("h3")?.textContent;
            const role = card.getAttribute("data-role") || card.querySelector(".role")?.textContent;
            const dept = card.getAttribute("data-department") || "General";
            const bio = card.querySelector(".bio")?.textContent || "";
            const imgSrc = card.querySelector(".profile-img img")?.src || "";
            const email = card.getAttribute("data-email") || "contact@company.com";

            currentEmail = email;

            modalMemberImg.src = imgSrc;
            modalMemberImg.alt = name;
            modalMemberName.textContent = name;
            modalMemberRole.textContent = role;
            modalMemberDept.textContent = dept.toUpperCase();
            modalMemberBio.textContent = bio;
            modalMemberEmail.href = `mailto:${email}`;

            memberModal.classList.add("active");
            memberModalClose.focus();
            document.body.style.overflow = "hidden";
        });
    });

    // Social Links Handling
    document.querySelectorAll(".social-icon").forEach((icon) => {
        icon.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const network = icon.getAttribute("data-network") || "social profile";
            const card = icon.closest(".team-card");
            const member = card ? card.getAttribute("data-name") : "Team member";
            showToast(`Connecting to ${member}'s ${network}...`);
        });
    });

    // Copy Email Action
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", () => {
            if (navigator.clipboard && currentEmail) {
                navigator.clipboard.writeText(currentEmail).then(() => {
                    showToast(`📋 Copied ${currentEmail} to clipboard!`);
                }).catch(() => {
                    showToast(`Email: ${currentEmail}`);
                });
            } else {
                showToast(`Email: ${currentEmail}`);
            }
        });
    }

    // Modal Close Functions
    function closeModals() {
        if (memberModal) memberModal.classList.remove("active");
        if (positionsModal) positionsModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (memberModalClose) memberModalClose.addEventListener("click", closeModals);
    if (positionsModalClose) positionsModalClose.addEventListener("click", closeModals);

    [memberModal, positionsModal].forEach((modal) => {
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModals();
            });
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModals();
    });

    // Open Positions Modal Trigger
    if (openPositionsBtn) {
        openPositionsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            positionsModal.classList.add("active");
            positionsModalClose.focus();
            document.body.style.overflow = "hidden";
        });
    }

    // Toast Notification Helper
    function showToast(message) {
        if (!toast) return;
        toast.innerHTML = `<i class="fas fa-info-circle" style="color:var(--primary-light);"></i><span>${message}</span>`;
        toast.classList.add("show");

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }
});
