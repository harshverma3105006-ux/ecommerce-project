const cartMessage = document.getElementById('cartMessage');
const cartContainer = document.getElementById('cartContainer');
const cartItemsList = document.getElementById('cartItemsList');
const totalItemsEl = document.getElementById('totalItems');
const totalPriceEl = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

const getCartItems = () => {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
};

const renderCart = () => {
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        cartContainer.style.display = 'none';
        cartMessage.style.display = 'block';
        cartMessage.className = 'alert alert-info';
        cartMessage.innerHTML = 'Your cart is empty <a href="../index.html" style="font-weight:bold; color:var(--primary-color); margin-left:10px;">Go Back</a>';
        return;
    }

    cartContainer.style.display = 'grid';
    cartMessage.style.display = 'none';
    cartItemsList.innerHTML = '';

    let totalQty = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        totalQty += item.qty;
        totalPrice += item.price * item.qty;

        const limit = Math.min(item.countInStock, 10);
        let optionsHtml = '';
        for (let i = 1; i <= limit; i++) {
            optionsHtml += `<option value="${i}" ${item.qty === i ? 'selected' : ''}>${i}</option>`;
        }

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image.startsWith('/') ? 'http://localhost:5000' + item.image : item.image}" alt="${item.name}" class="item-image">
            <a href="product.html?id=${item.product}" class="item-name">${item.name}</a>
            <div class="item-price">₹${item.price}</div>
            <select class="qty-select" onchange="updateCartItemqty('${item.product}', this.value)">
                ${optionsHtml}
            </select>
            <button class="btn-remove" onclick="removeCartItem('${item.product}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsList.appendChild(div);
    });

    totalItemsEl.textContent = totalQty;
    totalPriceEl.textContent = `₹${totalPrice.toFixed(2)}`;
};

window.updateCartItemqty = (productId, qty) => {
    const cartItems = getCartItems();
    const item = cartItems.find(x => x.product === productId);
    if (item) {
        item.qty = Number(qty);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        renderCart();
    }
};

window.removeCartItem = (productId) => {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(x => x.product !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    renderCart();
};

checkoutBtn.addEventListener('click', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'login.html?redirect=shipping.html';
    } else {
        window.location.href = 'shipping.html';
    }
});
