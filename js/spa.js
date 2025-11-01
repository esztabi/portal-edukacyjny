export function initializeSpa() {
    const sections = document.querySelectorAll('body > section');
    const portalCards = document.querySelectorAll('.portal-card');
    const backToPortalBtns = document.querySelectorAll('.kl-brand, .mnl-brand');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = (section.id === sectionId) ? 'block' : 'none';
        });
        window.scrollTo(0, 0);
    }

    portalCards.forEach(card => {
        card.addEventListener('click', () => showSection(card.dataset.target));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') showSection(card.dataset.target);
        });
    });

    backToPortalBtns.forEach(btn => {
        btn.addEventListener('click', () => showSection('portal-page'));
    });
}