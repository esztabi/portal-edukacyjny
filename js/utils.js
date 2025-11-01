export function setDynamicYear() {
    const klYear = document.getElementById('kl-year');
    const mnlYear = document.getElementById('mnl-year');
    const currentYear = new Date().getFullYear();
    if (klYear) klYear.textContent = currentYear;
    if (mnlYear) mnlYear.textContent = currentYear;
};

export function revealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
};