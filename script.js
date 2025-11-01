        document.addEventListener('DOMContentLoaded', () => {

            // ===================================================================
            // ========================= SPA NAVIGATION ========================
            // ===================================================================
            const sections = document.querySelectorAll('body > section');
            const portalCards = document.querySelectorAll('.portal-card');
            const backToPortalBtns = document.querySelectorAll('.kl-brand, .mnl-brand');

            function showSection(sectionId) {
                sections.forEach(section => {
                    if (section.id === sectionId) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
                window.scrollTo(0, 0);
            }

            portalCards.forEach(card => {
                card.addEventListener('click', () => {
                    showSection(card.dataset.target);
                });
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        showSection(card.dataset.target);
                    }
                });
            });

            backToPortalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    showSection('portal-page');
                });
            });

            // ===================================================================
            // ========================= GENERAL HELPERS =======================
            // ===================================================================
            const setDynamicYear = () => {
                const klYear = document.getElementById('kl-year');
                const mnlYear = document.getElementById('mnl-year');
                const currentYear = new Date().getFullYear();
                if (klYear) klYear.textContent = currentYear;
                if (mnlYear) mnlYear.textContent = currentYear;
            };

            const revealOnScroll = () => {
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

            // ===================================================================
            // ======================= KANATEK LAND LOGIC ======================
            // ===================================================================
            function initKanatekLand() {
                // --- Header & Nav ---
                const klHeader = document.querySelector('.kl-header');
                const hamburgerBtn = document.getElementById('kl-hamburger-btn');
                const navLinks = document.getElementById('kl-nav-links');

                window.addEventListener('scroll', () => {
                    if (document.getElementById('kanatek-land-page').style.display !== 'none') {
                        klHeader.classList.toggle('scrolled', window.scrollY > 50);
                    }
                });

                hamburgerBtn.addEventListener('click', () => {
                    const isExpanded = navLinks.classList.toggle('open');
                    hamburgerBtn.setAttribute('aria-expanded', isExpanded);
                });

                // --- Scroll Spy ---
                const navLinksAnchors = document.querySelectorAll('#kl-nav-links a');
                const klContentSections = document.querySelectorAll('#kanatek-land-page main section');

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

                // --- Course Filtering ---
                const categoryFilters = document.querySelectorAll('#category-filters input[type="checkbox"]');
                const ageFilter = document.getElementById('age-filter');
                const courseCards = document.querySelectorAll('.course-card');

                function filterCourses() {
                    const selectedCategories = Array.from(categoryFilters).filter(cb => cb.checked).map(cb => cb.value);
                    const selectedAge = ageFilter.value;

                    courseCards.forEach(card => {
                        const cardCategory = card.dataset.category;
                        const cardAge = card.dataset.age;

                        const categoryMatch = selectedCategories.includes(cardCategory);
                        const ageMatch = selectedAge === 'all' || cardAge === selectedAge;

                        if (categoryMatch && ageMatch) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }

                document.querySelectorAll('.kl-filters input, .kl-filters select').forEach(el => el.addEventListener('change', filterCourses));

                // --- Cart Logic ---
                const cartKey = 'kl_cart_v1';
                const cartBadge = document.getElementById('cart-badge');
                const cartModal = document.getElementById('cart-modal');
                const openCartBtn = document.getElementById('open-cart-btn');
                const closeCartBtn = document.getElementById('close-cart-btn');
                const cartItemsList = document.getElementById('cart-items-list');
                const cartTotalEl = document.querySelector('#cart-total strong');
                const cartEmptyMsg = document.getElementById('cart-empty-msg');
                const cartContent = document.getElementById('cart-content');
                const toast = document.getElementById('toast-notification');

                function getCart() {
                    return JSON.parse(localStorage.getItem(cartKey)) || [];
                }

                function saveCart(cart) {
                    localStorage.setItem(cartKey, JSON.stringify(cart));
                    updateCartUI();
                }

                function addToCart(product) {
                    let cart = getCart();
                    const existingItem = cart.find(item => item.id === product.id);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({...product, quantity: 1 });
                    }
                    saveCart(cart);
                    showToast(`${product.name} dodano do koszyka!`);
                }

                function removeFromCart(productId) {
                    let cart = getCart().filter(item => item.id !== productId);
                    saveCart(cart);
                }

                function updateCartUI() {
                    const cart = getCart();
                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

                    cartBadge.textContent = totalItems;
                    cartBadge.classList.toggle('visible', totalItems > 0);

                    if (cart.length === 0) {
                        cartEmptyMsg.style.display = 'block';
                        cartItemsList.innerHTML = '';
                        cartTotalEl.textContent = '$0.00';
                        document.querySelector('#cart-content .btn-primary').style.display = 'none';
                    } else {
                        cartEmptyMsg.style.display = 'none';
                        document.querySelector('#cart-content .btn-primary').style.display = 'block';
                        cartItemsList.innerHTML = cart.map(item => `
                            <li class="cart-item">
                                <div class="cart-item-info">
                                    <span>${item.name} (x${item.quantity})</span>
                                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                <button class="remove-from-cart-btn" data-id="${item.id}" aria-label="Usuń ${item.name} z koszyka">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </li>
                        `).join('');

                        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        cartTotalEl.textContent = `$${total.toFixed(2)}`;
                    }
                }

                function showToast(message) {
                    toast.textContent = message;
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                }

                document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const { id, name, price } = e.target.dataset;
                        addToCart({ id, name, price: parseFloat(price) });
                    });
                });

                cartItemsList.addEventListener('click', (e) => {
                    const removeBtn = e.target.closest('.remove-from-cart-btn');
                    if (removeBtn) {
                        removeFromCart(removeBtn.dataset.id);
                    }
                });

                openCartBtn.addEventListener('click', () => cartModal.showModal());
                closeCartBtn.addEventListener('click', () => cartModal.close());
                cartModal.addEventListener('click', (e) => {
                    if (e.target === cartModal) cartModal.close();
                });

                updateCartUI();

                // --- Testimonials Carousel (KL) ---
                const klCarouselTrack = document.querySelector('.kl-carousel-track');
                const klSlides = Array.from(klCarouselTrack.children);
                const klNextBtn = document.querySelector('.kl-carousel-btn.next');
                const klPrevBtn = document.querySelector('.kl-carousel-btn.prev');
                const klCarouselWrapper = document.querySelector('.kl-carousel-wrapper');

                let klCurrentIndex = 0;
                let klSlideWidth = 0;
                let klInterval;

                function setupKlCarousel() {
                    klSlideWidth = klSlides[0].getBoundingClientRect().width;
                    klSlides.forEach((slide, index) => {
                        slide.style.left = `${klSlideWidth * index}px`;
                    });
                    klCarouselTrack.style.transform = `translateX(-${klCurrentIndex * klSlideWidth}px)`;
                }

                const moveToKlSlide = (targetIndex) => {
                    klCarouselTrack.style.transform = `translateX(-${targetIndex * klSlideWidth}px)`;
                    klCurrentIndex = targetIndex;
                };

                klNextBtn.addEventListener('click', () => {
                    const newIndex = (klCurrentIndex + 1) % klSlides.length;
                    moveToKlSlide(newIndex);
                });
                klPrevBtn.addEventListener('click', () => {
                    const newIndex = (klCurrentIndex - 1 + klSlides.length) % klSlides.length;
                    moveToKlSlide(newIndex);
                });

                const startKlAutoplay = () => {
                    klInterval = setInterval(() => {
                        klNextBtn.click();
                    }, 6000);
                }

                const stopKlAutoplay = () => clearInterval(klInterval);

                klCarouselWrapper.addEventListener('mouseenter', stopKlAutoplay);
                klCarouselWrapper.addEventListener('mouseleave', startKlAutoplay);

                window.addEventListener('resize', setupKlCarousel);
                setupKlCarousel();
                startKlAutoplay();

                // --- Newsletter ---
                const newsletterForm = document.getElementById('kl-newsletter-form');
                const newsletterEmail = document.getElementById('newsletter-email');
                const newsletterStatus = document.getElementById('newsletter-status');

                newsletterForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = newsletterEmail.value;
                    localStorage.setItem('kl_newsletter', email);
                    newsletterStatus.textContent = "Zapisano! Dziękujemy za dołączenie.";
                    newsletterEmail.value = '';
                    setTimeout(() => newsletterStatus.textContent = '', 4000);
                });

                // --- Trial Lesson Modal ---
                const trialModal = document.getElementById('kl-trial-modal');
                const openTrialBtns = document.querySelectorAll('.kl-open-trial-modal-btn');
                const trialForm = document.getElementById('kl-trial-form');
                const preferredCourseInput = document.getElementById('preferred-course');
                const trialFormStatus = document.getElementById('trial-form-status');

                openTrialBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        preferredCourseInput.value = btn.dataset.course || '';
                        trialModal.showModal();
                        trialModal.querySelector('input,select').focus();
                    });
                });

                trialForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    trialFormStatus.textContent = 'Dziękujemy! Odezwiemy się w ciągu 24 h…';
                    trialFormStatus.style.color = 'green';
                    setTimeout(() => {
                        trialModal.close();
                        trialFormStatus.textContent = '';
                        trialForm.reset();
                    }, 1200);
                });

                // --- Search ---
                const searchForm = document.getElementById('kl-search-form');
                const searchInput = document.getElementById('kl-search-input');

                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim().toLowerCase();
                    if (!query) return;

                    const searchableItems = document.querySelectorAll('#kanatek-land-page .searchable-item');
                    let firstMatch = null;

                    searchableItems.forEach(item => {
                        item.classList.remove('search-highlight');
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

            // ===================================================================
            // ==================== MAŁY NAUKOWIEC LAB LOGIC ===================
            // ===================================================================
            function initMalyNaukowiec() {
                // --- Header & Nav ---
                const mnlHeader = document.querySelector('.mnl-header');
                const mnlHamburger = document.getElementById('mnl-hamburger-btn');
                const mnlNavLinks = document.getElementById('mnl-nav-links');

                window.addEventListener('scroll', () => {
                    if (document.getElementById('maly-naukowiec-page').style.display !== 'none') {
                        mnlHeader.classList.toggle('scrolled', window.scrollY > 10);
                    }
                });

                mnlHamburger.addEventListener('click', () => {
                    const isExpanded = mnlNavLinks.classList.toggle('slide-down');
                    mnlHamburger.setAttribute('aria-expanded', isExpanded);
                });

                // --- Testimonials Carousel (MNL) ---
                const mnlSlidesContainer = document.getElementById('mnl-slides');
                const mnlSlides = Array.from(mnlSlidesContainer.children);
                const mnlDotsContainer = document.getElementById('mnl-dots');
                const mnlCarousel = document.querySelector('.mnl-carousel');

                let mnlCurrentIndex = 0;
                let mnlSlideWidth = 0;
                let mnlInterval;

                function setupMnlCarousel() {
                    mnlSlideWidth = mnlCarousel.clientWidth;
                    mnlSlides.forEach(slide => slide.style.minWidth = `${mnlSlideWidth}px`);
                    mnlSlidesContainer.style.transform = `translateX(-${mnlCurrentIndex * mnlSlideWidth}px)`;
                    updateDots();
                }

                mnlSlides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('dot');
                    dot.setAttribute('aria-label', `Przejdź do slajdu ${index + 1}`);
                    dot.addEventListener('click', () => moveToMnlSlide(index));
                    mnlDotsContainer.appendChild(dot);
                });

                const mnlDots = Array.from(mnlDotsContainer.children);

                const updateDots = () => {
                    mnlDots.forEach((dot, index) => {
                        dot.setAttribute('aria-current', index === mnlCurrentIndex);
                    });
                };

                const moveToMnlSlide = (index) => {
                    mnlSlidesContainer.style.transform = `translateX(-${index * mnlSlideWidth}px)`;
                    mnlCurrentIndex = index;
                    updateDots();
                };

                const startMnlAutoplay = () => {
                    mnlInterval = setInterval(() => {
                        const newIndex = (mnlCurrentIndex + 1) % mnlSlides.length;
                        moveToMnlSlide(newIndex);
                    }, 5000);
                }

                const stopMnlAutoplay = () => clearInterval(mnlInterval);

                mnlCarousel.addEventListener('mouseenter', stopMnlAutoplay);
                mnlCarousel.addEventListener('mouseleave', startMnlAutoplay);

                window.addEventListener('resize', setupMnlCarousel);

                setupMnlCarousel();
                startMnlAutoplay();
            }

            // ===================================================================
            // ======================== INITIALIZATION =========================
            // ===================================================================
            setDynamicYear();
            revealOnScroll();
            initKanatekLand();
            initMalyNaukowiec();

        });