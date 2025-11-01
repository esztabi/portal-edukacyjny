// js/mnl-logic.js

// Inicjalizuje całą logikę specyficzną dla podstrony "Mały Naukowiec Lab"
export function initMalyNaukowiec() {

    // --- Header & Navigation Logic ---
    const mnlHeader = document.querySelector('.mnl-header');
    const mnlHamburger = document.getElementById('mnl-hamburger-btn');
    const mnlNavLinks = document.getElementById('mnl-nav-links');

    // Dodaje klasę .scrolled do nagłówka po przewinięciu strony
    if (mnlHeader) {
        window.addEventListener('scroll', () => {
            // Sprawdzamy, czy strona MNL jest aktualnie widoczna
            const mnlPage = document.getElementById('maly-naukowiec-page');
            if (mnlPage && mnlPage.style.display !== 'none') {
                mnlHeader.classList.toggle('scrolled', window.scrollY > 10);
            }
        });
    }

    // Obsługa mobilnego menu (hamburger)
    if (mnlHamburger && mnlNavLinks) {
        mnlHamburger.addEventListener('click', () => {
            // Przełącza klasę .slide-down, która pokazuje/ukrywa menu
            const isExpanded = mnlNavLinks.classList.toggle('slide-down');

            // Aktualizuje atrybut ARIA dla lepszej dostępności
            mnlHamburger.setAttribute('aria-expanded', isExpanded);
        });
    }

    console.log("Mały Naukowiec Lab logic initialized.");
}