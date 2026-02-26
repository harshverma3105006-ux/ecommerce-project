const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

const orderContainer = document.getElementById('orderContainer');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

const orderIdText = document.getElementById('orderIdText');
const orderUserName = document.getElementById('orderUserName');
const orderUserEmail = document.getElementById('orderUserEmail');
const shippingDisplay = document.getElementById('shippingDisplay');
const deliverStatus = document.getElementById('deliverStatus');
const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
const paymentStatus = document.getElementById('paymentStatus');
const orderItemsList = document.getElementById('orderItemsList');

const itemsPriceEl = document.getElementById('itemsPrice');
const shippingPriceEl = document.getElementById('shippingPrice');
const taxPriceEl = document.getElementById('taxPrice');
const totalPriceEl = document.getElementById('totalPrice');

document.addEventListener('DOMContentLoaded', () => {
    if (!orderId) {
        window.location.href = '../index.html';
        return;
    }
    loadOrder();
});

const loadOrder = async () => {
    showLoader(loading);
    orderContainer.style.display = 'none';

    try {
        const order = await fetchAPI(`/orders/${orderId}`, 'GET', null, true);

        orderIdText.textContent = order._id;
        orderUserName.textContent = order.user.name;
        orderUserEmail.textContent = order.user.email;
        orderUserEmail.href = `mailto:${order.user.email}`;

        shippingDisplay.textContent = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;

        if (order.isDelivered) {
            deliverStatus.className = 'alert-box alert-success-box';
            deliverStatus.textContent = `Delivered on ${new Date(order.deliveredAt).toLocaleString()}`;
        } else {
            deliverStatus.className = 'alert-box alert-danger-box';
            deliverStatus.textContent = 'Not Delivered';
        }

        paymentMethodDisplay.textContent = order.paymentMethod;

        if (order.isPaid) {
            paymentStatus.className = 'alert-box alert-success-box';
            paymentStatus.textContent = `Paid on ${new Date(order.paidAt).toLocaleString()}`;
        } else {
            paymentStatus.className = 'alert-box alert-danger-box';
            paymentStatus.textContent = 'Not Paid';
        }

        // Display Items
        orderItemsList.innerHTML = '';
        let itemsSum = 0;
        order.orderItems.forEach(item => {
            const itemTotal = Number(item.qty) * Number(item.price);
            itemsSum += itemTotal;
            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <img src="${item.image.startsWith('/') ? 'http://localhost:5000' + item.image : item.image}" alt="${item.name}">
                <a href="product.html?id=${item.product}" class="order-item-name">${item.name}</a>
                <div style="font-weight: 500;">
                    ${item.qty} x ₹${item.price} = <span style="color:var(--primary-color);">₹${itemTotal.toFixed(2)}</span>
                </div>
            `;
            orderItemsList.appendChild(div);
        });

        // Prices
        itemsPriceEl.textContent = `₹${itemsSum.toFixed(2)}`;
        shippingPriceEl.textContent = `₹${order.shippingPrice.toFixed(2)}`;
        taxPriceEl.textContent = `₹${order.taxPrice.toFixed(2)}`;
        totalPriceEl.textContent = `₹${order.totalPrice.toFixed(2)}`;

        orderContainer.style.display = 'grid';

    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message;
    } finally {
        hideLoader(loading);
    }
};
