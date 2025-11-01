// ===================================================================
// ========================== IMPORTS ================================
// ===================================================================
// Tutaj "zbieramy" wszystkie nasze narzędzia z innych plików.

// Import logiki do przełączania podstron SPA
import { initializeSpa } from './spa.js';

// Import uniwersalnych funkcji pomocniczych (rok w stopce, animacje)
import { setDynamicYear, revealOnScroll } from './utils.js';

// Import logiki specyficznej dla podstrony Kanatek Land
import { initKanatekLand } from './kl-logic.js';

// Import logiki specyficznej dla podstrony Mały Naukowiec Lab
import { initMalyNaukowiec } from './mnl-logic.js';

// Import uniwersalnego modułu koszyka
import { initCart } from './cart.js';

// Import UNIWERSALNEGO modułu karuzeli
import { createCarousel } from './carousel.js';


// ===================================================================
// ======================== INITIALIZATION ===========================
// ===================================================================
// Tutaj "uruchamiamy" wszystkie zaimportowane funkcje w logicznej kolejności.

// 1. Uruchom globalne funkcje, które muszą działać od początku
initializeSpa();
setDynamicYear();
revealOnScroll();

// 2. Uruchom logikę specyficzną dla każdej "podstrony"
initKanatekLand();
initMalyNaukowiec();

// 3. Uruchom niezależne moduły, które działają na całej stronie
initCart();

// 4. Uruchom karuzele, przekazując im odpowiednie konfiguracje
createCarousel({
    wrapperSelector: '.kl-carousel-wrapper',
    trackSelector: '.kl-carousel-track',
    prevButtonSelector: '.kl-carousel-btn.prev',
    nextButtonSelector: '.kl-carousel-btn.next',
    autoplayInterval: 6000
});

createCarousel({
    wrapperSelector: '.mnl-carousel',
    trackSelector: '#mnl-slides',
    dotsContainerSelector: '#mnl-dots',
    autoplayInterval: 5000
});

console.log("Portal Edukacyjny został pomyślnie zainicjowany!");