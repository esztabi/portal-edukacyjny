/**
 * Tworzy i inicjalizuje w pełni funkcjonalną, responsywną karuzelę.
 * @param {object} options - Obiekt konfiguracyjny.
 * @param {string} options.wrapperSelector - Selektor CSS dla głównego kontenera karuzeli (do pauzy na hover).
 * @param {string} options.trackSelector - Selektor CSS dla elementu 'track', który zawiera slajdy.
 * @param {string} [options.prevButtonSelector] - (Opcjonalny) Selektor dla przycisku "poprzedni".
 * @param {string} [options.nextButtonSelector] - (Opcjonalny) Selektor dla przycisku "następny".
 * @param {string} [options.dotsContainerSelector] - (Opcjonalny) Selektor dla kontenera na kropki nawigacyjne.
 * @param {number} [options.autoplayInterval=5000] - (Opcjonalny) Czas w ms dla autoprzewijania. Ustaw na 0, by wyłączyć.
 */
export function createCarousel(options) {
    // 1. Pobieranie elementów na podstawie selektorów z obiektu 'options'
    const wrapper = document.querySelector(options.wrapperSelector);
    const track = document.querySelector(options.trackSelector);
    if (!wrapper || !track) {
        console.error("Carousel not initialized: wrapper or track not found.", options);
        return;
    }

    const slides = Array.from(track.children);
    if (slides.length === 0) {
        console.warn("Carousel initialized, but no slides were found inside the track.", options);
        return; // Zatrzymaj wykonywanie, jeśli nie ma slajdów
    }

    const prevBtn = options.prevButtonSelector ? document.querySelector(options.prevButtonSelector) : null;
    const nextBtn = options.nextButtonSelector ? document.querySelector(options.nextButtonSelector) : null;
    const dotsContainer = options.dotsContainerSelector ? document.querySelector(options.dotsContainerSelector) : null;

    // 2. Stan karuzeli (enkapsulowany wewnątrz tej funkcji)
    let currentIndex = 0;
    let slideWidth = 0;
    let autoplayInterval;
    let dots = [];

    // 3. Logika wewnętrzna (przeniesiona i uogólniona)
    const setup = () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        // Upewniamy się, że slajdy mają właściwą szerokość (ważne dla karuzeli z kropkami)
        slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}px`;
        });
        moveToSlide(currentIndex);
    };

    const moveToSlide = (targetIndex) => {
        if (!track) return;
        track.style.transform = `translateX(-${targetIndex * slideWidth}px)`;
        currentIndex = targetIndex;
        if (dotsContainer) updateDots();
    };

    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.setAttribute('aria-current', index === currentIndex);
        });
    };

    const startAutoplay = () => {
        if (!options.autoplayInterval || options.autoplayInterval === 0) return;
        stopAutoplay(); // Zapewnia, że nie ma wielu interwałów naraz
        autoplayInterval = setInterval(() => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        }, options.autoplayInterval);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // 4. Inicjalizacja Event Listenerów i kropek (jeśli istnieją)
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = ''; // Czyścimy na wypadek ponownej inicjalizacji
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Przejdź do slajdu ${index + 1}`);
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });
        dots = Array.from(dotsContainer.children);
    }

    // Autoplay i responsywność
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    window.addEventListener('resize', setup);

    // 5. Pierwsze uruchomienie
    setup();
    startAutoplay();
    if (dotsContainer) updateDots();
}