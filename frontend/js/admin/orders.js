const ordersTableBody = document.getElementById('ordersTableBody');
const loading = document.getElementById('loading');
const messageBox = document.getElementById('message');
const contentContainer = document.getElementById('contentContainer');

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadOrders();
});

const checkAdminAuth = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
        window.location.href = '../../index.html';
    }
};

const loadOrders = async () => {
    showLoader(loading);
    contentContainer.style.display = 'none';
    hideMessage(messageBox);

    try {
        const orders = await fetchAPI('/orders', 'GET', null, true);

        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().substring(0, 10);

            const isPaidHtml = order.isPaid
                ? `<span style="color:var(--success-color);">${order.paidAt.substring(0, 10)}</span>`
                : '<i class="fas fa-times" style="color:var(--danger-color);"></i>';

            const isDeliveredHtml = order.isDelivered
                ? `<span style="color:var(--success-color);">${order.deliveredAt.substring(0, 10)}</span>`
                : '<i class="fas fa-times" style="color:var(--danger-color);"></i>';

            // Mark Delivery Button if paid but not delivered
            let actionHtml = `<a href="../order.html?id=${order._id}" class="btn btn-primary btn-sm">Details</a>`;
            if (order.isPaid && !order.isDelivered) {
                actionHtml += ` <button class="btn btn-primary btn-sm" onclick="markDelivered('${order._id}')" style="background:#10b981;">Deliver</button>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order._id.substring(0, 8)}...</td>
                <td>${order.user && order.user.name ? order.user.name : 'Unknown User'}</td>
                <td>${date}</td>
                <td>₹${order.totalPrice}</td>
                <td>${isPaidHtml}</td>
                <td>${isDeliveredHtml}</td>
                <td>${actionHtml}</td>
            `;
            ordersTableBody.appendChild(tr);
        });

        contentContainer.style.display = 'block';
    } catch (error) {
        showMessage(messageBox, error.message);
    } finally {
        hideLoader(loading);
    }
};

window.markDelivered = async (id) => {
    if (confirm('Mark this order as delivered?')) {
        try {
            await fetchAPI(`/orders/${id}/deliver`, 'PUT', {}, true);
            showMessage(messageBox, 'Order marked as delivered', 'success');
            loadOrders();
        } catch (error) {
            showMessage(messageBox, error.message);
        }
    }
};
