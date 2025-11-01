// js/spa.js

export function initializeSpa() {
    const sections = document.querySelectorAll('body > section');
    const showSectionTriggers = document.querySelectorAll('.js-show-section');

    function showSection(sectionId) {
        sections.forEach(section => {
            // Używamy flex zamiast block dla #contact-page
            if (section.id === sectionId) {
                section.style.display = (section.id === 'contact-page') ? 'flex' : 'block';
            } else {
                section.style.display = 'none';
            }
        });

        // Sprawdzamy czy w URL jest parametr sukcesu i wyświetlamy komunikat
        if (sectionId === 'contact-page' && window.location.search.includes('form-success=true')) {
            const successMessageContainer = document.getElementById('contact-page-success-message');
            if (successMessageContainer) {
                successMessageContainer.textContent = "Dziękujemy! Wiadomość została wysłana.";
            }
        }

        window.scrollTo(0, 0);
    }

    // Ten jeden listener obsłuży teraz wszystkie przyciski i karty
    showSectionTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            // Zapobiegamy domyślnemu zachowaniu linków (przeskakiwanie do #)
            event.preventDefault();
            const targetSection = trigger.dataset.target;
            if (targetSection) {
                showSection(targetSection);
            }
        });

        // Dodajemy obsługę klawiatury dla elementów, które nie są linkami
        if (trigger.tagName !== 'A') {
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const targetSection = trigger.dataset.target;
                    if (targetSection) {
                        showSection(targetSection);
                    }
                }
            });
        }
    });

    // Obsługa starych przycisków "powrotu"
    document.querySelectorAll('.kl-brand, .mnl-brand').forEach(btn => {
        btn.addEventListener('click', () => showSection('portal-page'));
    });
}