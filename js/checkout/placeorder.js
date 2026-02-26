const shippingDisplay = document.getElementById('shippingDisplay');
const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
const orderItemsList = document.getElementById('orderItemsList');
const itemsPriceEl = document.getElementById('itemsPrice');
const shippingPriceEl = document.getElementById('shippingPrice');
const taxPriceEl = document.getElementById('taxPrice');
const totalPriceEl = document.getElementById('totalPrice');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const orderError = document.getElementById('orderError');

let cartItems = [];
let shippingAddress = {};
let paymentMethod = '';
let prices = {};

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'login.html?redirect=shipping.html';
        return;
    }

    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    paymentMethod = localStorage.getItem('paymentMethod');

    if (cartItems.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    if (!shippingAddress) {
        window.location.href = 'shipping.html';
        return;
    }
    if (!paymentMethod) {
        window.location.href = 'payment.html';
        return;
    }

    renderPlaceOrder();
});

const renderPlaceOrder = () => {
    // Display Details
    shippingDisplay.textContent = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
    paymentMethodDisplay.textContent = paymentMethod;

    // Display Items
    orderItemsList.innerHTML = '';
    cartItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <img src="${item.image.startsWith('/') ? '' + item.image : item.image}" alt="${item.name}">
            <a href="product.html?id=${item.product}" class="order-item-name">${item.name}</a>
            <div style="font-weight: 500;">
                ${item.qty} x ₹${item.price} = <span style="color:var(--primary-color);">₹${(item.qty * item.price).toFixed(2)}</span>
            </div>
        `;
        orderItemsList.appendChild(div);
    });

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    prices = {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    };

    itemsPriceEl.textContent = `₹${itemsPrice.toFixed(2)}`;
    shippingPriceEl.textContent = `₹${shippingPrice.toFixed(2)}`;
    taxPriceEl.textContent = `₹${taxPrice.toFixed(2)}`;
    totalPriceEl.textContent = `₹${totalPrice}`;
};

placeOrderBtn.addEventListener('click', async () => {
    const originalBtnText = placeOrderBtn.textContent;
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    hideMessage(orderError);

    try {
        const orderData = {
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice: prices.itemsPrice,
            shippingPrice: prices.shippingPrice,
            taxPrice: prices.taxPrice,
            totalPrice: prices.totalPrice
        };

        const createdOrder = await fetchAPI('/orders', 'POST', orderData, true);

        if (paymentMethod === 'Razorpay') {
            await handleRazorpayPayment(createdOrder);
        } else {
            // Cash on Delivery
            localStorage.removeItem('cartItems');
            window.location.href = `order.html?id=${createdOrder._id}`;
        }

    } catch (error) {
        showMessage(orderError, error.message);
        placeOrderBtn.textContent = originalBtnText;
        placeOrderBtn.disabled = false;
    }
});

const handleRazorpayPayment = async (order) => {
    try {
        // 1. Get Razorpay Key Id
        const { keyId } = await fetch('/api/payment/config').then(res => res.text()).then(key => ({ keyId: key }));

        // 2. Create Razorpay order on backend
        const rpOrder = await fetchAPI('/payment/create-order', 'POST', { amount: order.totalPrice }, true);

        // 3. Open Razorpay Flow
        const options = {
            key: keyId,
            amount: rpOrder.amount,
            currency: "INR",
            name: "ProShop",
            description: "Premium E-Commerce Order",
            order_id: rpOrder.id,
            handler: async function (response) {
                // 4. On Success, Update Order to Paid
                try {
                    const paymentResult = {
                        id: response.razorpay_payment_id,
                        status: 'Success',
                        update_time: new Date().toISOString(),
                    };

                    await fetchAPI(`/orders/${order._id}/pay`, 'PUT', paymentResult, true);

                    // Clear cart and redirect
                    localStorage.removeItem('cartItems');
                    window.location.href = `order.html?id=${order._id}`;

                } catch (updateError) {
                    showMessage(orderError, 'Payment success but failed to update order status. Contact support.');
                    placeOrderBtn.disabled = false;
                    placeOrderBtn.textContent = 'Place Order';
                }
            },
            prefill: {
                name: JSON.parse(localStorage.getItem('userInfo')).name,
                email: JSON.parse(localStorage.getItem('userInfo')).email,
            },
            theme: {
                color: "#4f46e5"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            showMessage(orderError, 'Payment Failed: ' + response.error.description);
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        });
        rzp1.open();

    } catch (error) {
        showMessage(orderError, 'Razorpay initialization failed.');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    }
};
