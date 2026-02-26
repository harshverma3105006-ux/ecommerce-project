const paymentForm = document.getElementById('paymentForm');

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'login.html?redirect=shipping.html';
        return;
    }

    // Check Shipping Address
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    if (!shippingAddress) {
        window.location.href = 'shipping.html';
        return;
    }

    // Load saved payment method
    const savedPaymentMethod = localStorage.getItem('paymentMethod');
    if (savedPaymentMethod === 'Cash On Delivery') {
        document.getElementById('cod').checked = true;
    } else {
        document.getElementById('razorpay').checked = true; // default
    }
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    localStorage.setItem('paymentMethod', selectedMethod);

    window.location.href = 'placeorder.html';
});
