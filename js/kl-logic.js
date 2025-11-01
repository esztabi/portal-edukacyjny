// js/kl-logic.js

// Inicjalizuje całą logikę specyficzną dla podstrony "Kanatek Land"
export function initKanatekLand() {

    // --- Header & Nav ---
    const klHeader = document.querySelector('.kl-header');
    const hamburgerBtn = document.getElementById('kl-hamburger-btn');
    const navLinks = document.getElementById('kl-nav-links');

    if (klHeader) {
        window.addEventListener('scroll', () => {
            // Upewniamy się, że header istnieje i że jesteśmy na właściwej stronie
            if (document.getElementById('kanatek-land-page').style.display !== 'none') {
                klHeader.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
    }

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = navLinks.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- Scroll Spy ---
    const navLinksAnchors = document.querySelectorAll('#kl-nav-links a');
    const klContentSections = document.querySelectorAll('#kanatek-land-page main > section');

    if (navLinksAnchors.length > 0 && klContentSections.length > 0) {
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinksAnchors.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-30% 0px -70% 0px' });

        klContentSections.forEach(section => scrollSpyObserver.observe(section));
    }


    // --- Course Filtering ---
    const filtersContainer = document.querySelector('.kl-filters');
    if (filtersContainer) {
        const categoryFilters = filtersContainer.querySelectorAll('#category-filters input[type="checkbox"]');
        const ageFilter = filtersContainer.querySelector('#age-filter');
        const courseCards = document.querySelectorAll('.course-card');

        function filterCourses() {
            const selectedCategories = Array.from(categoryFilters).filter(cb => cb.checked).map(cb => cb.value);
            const selectedAge = ageFilter.value;

            courseCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const cardAge = card.dataset.age;

                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(cardCategory);
                const ageMatch = selectedAge === 'all' || cardAge === selectedAge;

                card.style.display = (categoryMatch && ageMatch) ? 'flex' : 'none';
            });
        }

        document.querySelectorAll('.kl-filters input, .kl-filters select').forEach(el => el.addEventListener('change', filterCourses));
    }


    // --- Newsletter ---
    const newsletterForm = document.getElementById('kl-newsletter-form');
    if (newsletterForm) {
        const newsletterEmail = document.getElementById('newsletter-email');
        const newsletterStatus = document.getElementById('newsletter-status');

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value;
            if (email && newsletterStatus) {
                localStorage.setItem('kl_newsletter', email);
                newsletterStatus.textContent = "Zapisano! Dziękujemy za dołączenie.";
                newsletterEmail.value = '';
                setTimeout(() => newsletterStatus.textContent = '', 4000);
            }
        });
    }


    // --- Trial Lesson Modal ---
    const trialModal = document.getElementById('kl-trial-modal');
    if (trialModal) {
        const openTrialBtns = document.querySelectorAll('.kl-open-trial-modal-btn');
        const trialForm = document.getElementById('kl-trial-form');
        const preferredCourseInput = document.getElementById('preferred-course');
        const trialFormStatus = document.getElementById('trial-form-status');

        openTrialBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (preferredCourseInput) {
                    preferredCourseInput.value = btn.dataset.course || '';
                }
                trialModal.showModal();
                trialModal.querySelector('input,select').focus();
            });
        });

        if (trialForm) {
            trialForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (trialFormStatus) {
                    trialFormStatus.textContent = 'Dziękujemy! Odezwiemy się w ciągu 24 h…';
                    trialFormStatus.style.color = 'green';
                }
                setTimeout(() => {
                    trialModal.close();
                    if (trialFormStatus) trialFormStatus.textContent = '';
                    trialForm.reset();
                }, 1200);
            });
        }
    }


    // --- Search ---
    const searchForm = document.getElementById('kl-search-form');
    if (searchForm) {
        const searchInput = document.getElementById('kl-search-input');

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;

            const searchableItems = document.querySelectorAll('#kanatek-land-page .searchable-item');
            let firstMatch = null;

            searchableItems.forEach(item => item.classList.remove('search-highlight'));

            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.classList.add('search-highlight');
                    if (!firstMatch) {
                        firstMatch = item;
                    }
                }
            });

            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert(`Brak wyników dla "${query}". Spróbuj wyszukać "robot", "programowanie" lub "druk 3d".`);
            }
        });
    }

    const successMessageContainer = document.getElementById('contact-success-message');
    if (successMessageContainer && window.location.search.includes('form-success=true')) {
        successMessageContainer.textContent = "Dziękujemy za wiadomość! Odezwiemy się wkrótce.";
    }

    console.log("Kanatek Land logic initialized.");
}