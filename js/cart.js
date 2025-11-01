// cart.js

// Eksportujemy jedną funkcję, która uruchomi całą logikę koszyka.
export function initCart() {

    // 1. SELEKTORY I STAN
    const cartKey = 'kl_cart_v1';
    const cartBadge = document.getElementById('cart-badge');
    const cartModal = document.getElementById('cart-modal');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalEl = document.querySelector('#cart-total strong');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const toast = document.getElementById('toast-notification');

    // Sprawdzenie, czy wszystkie elementy istnieją, aby uniknąć błędów
    if (!cartBadge || !cartModal || !openCartBtn || !closeCartBtn || !cartItemsList || !cartTotalEl || !cartEmptyMsg || !toast) {
        console.error("Cart elements not found. Cart initialization aborted.");
        return;
    }

    // 2. GŁÓWNE FUNKCJE (logika wewnętrzna modułu)
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

        const cartContentContainer = document.querySelector('#cart-content');
        if (!cartContentContainer) return;

        if (cart.length === 0) {
            cartEmptyMsg.style.display = 'block';
            cartItemsList.innerHTML = '';
            cartTotalEl.textContent = '$0.00';
            cartContentContainer.querySelector('.btn-primary').style.display = 'none';
        } else {
            cartEmptyMsg.style.display = 'none';
            cartContentContainer.querySelector('.btn-primary').style.display = 'block';
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

    // 3. EVENT LISTENERS
    document.body.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const { id, name, price } = addToCartBtn.dataset;
            addToCart({ id, name, price: parseFloat(price) });
        }
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

    // 4. INICJALIZACJA
    updateCartUI();
    console.log("Cart module initialized.");
}