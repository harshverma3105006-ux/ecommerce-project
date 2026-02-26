// DOM Elements
const themeToggleBtn = document.getElementById('themeToggle');
const cartCountBadge = document.getElementById('cartCount');
const loginLink = document.getElementById('loginLink');
const userMenuContainer = document.getElementById('userMenuContainer');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize App
const initApp = () => {
    // 1. Theme Check
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // 2. Auth Check
    updateNavAuth();

    // 3. Cart Check
    updateCartCount();
};

// Toggle Theme
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Update Navigation based on auth status
const updateNavAuth = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) {
        // User is logged in
        loginLink.innerHTML = `<i class="fas fa-user-circle"></i> ${userInfo.name.split(' ')[0]} <i class="fas fa-caret-down"></i>`;
        loginLink.href = "#"; // Prevent navigation, instead toggle dropdown

        // Remove old event listeners if any (simple approach: clone and replace)
        const newLoginLink = loginLink.cloneNode(true);
        loginLink.parentNode.replaceChild(newLoginLink, loginLink);

        newLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.toggle('show');
        });

    } else {
        // User not logged in
        loginLink.innerHTML = `<i class="fas fa-user"></i> Sign In`;
        // Ensure path is relative to current page location if we're on a subpage or root
        loginLink.href = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
        userDropdown.classList.remove('show');
    }
};

// Close dropdown if clicked outside
window.onclick = function (event) {
    if (!event.target.matches('#loginLink') && !event.target.parentElement.matches('#loginLink')) {
        if (userDropdown && userDropdown.classList.contains('show')) {
            userDropdown.classList.remove('show');
        }
    }
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userInfo');
        updateNavAuth();
        window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    });
}

// Update Cart Count
const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
    if (cartCountBadge) {
        cartCountBadge.textContent = count;
    }
};

// Add to Cart Utility (Shared across pages)
const addToCartUtility = (product, qty = 1) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
        existItem.qty += qty;
    } else {
        cartItems.push({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: qty,
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    // Optional Toast Notification
    alert(`${product.name} added to cart!`);
};

// Utilities for UI
const showMessage = (element, message, type = 'danger') => {
    if (element) {
        element.style.display = 'block';
        element.textContent = message;
        element.className = `alert alert-${type}`;
    }
};

const hideMessage = (element) => {
    if (element) element.style.display = 'none';
};

const showLoader = (element) => {
    if (element) element.style.display = 'block';
};

const hideLoader = (element) => {
    if (element) element.style.display = 'none';
};

// Run init
document.addEventListener('DOMContentLoaded', initApp);
