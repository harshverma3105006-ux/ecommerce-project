const shippingForm = document.getElementById('shippingForm');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const postalCodeInput = document.getElementById('postalCode');
const countryInput = document.getElementById('country');

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'login.html?redirect=shipping.html';
        return;
    }

    // Load saved shipping address
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    if (shippingAddress) {
        addressInput.value = shippingAddress.address || '';
        cityInput.value = shippingAddress.city || '';
        postalCodeInput.value = shippingAddress.postalCode || '';
        countryInput.value = shippingAddress.country || '';
    }
});

shippingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const shippingAddress = {
        address: addressInput.value,
        city: cityInput.value,
        postalCode: postalCodeInput.value,
        country: countryInput.value,
    };

    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    window.location.href = 'payment.html';
});
