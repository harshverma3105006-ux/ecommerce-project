const profileForm = document.getElementById('profileForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const profileMessage = document.getElementById('profileMessage');
const updateBtn = document.getElementById('updateBtn');

const ordersLoader = document.getElementById('ordersLoader');
const ordersMessage = document.getElementById('ordersMessage');
const ordersTable = document.getElementById('ordersTable');
const ordersBody = document.getElementById('ordersBody');

// Check auth on load
document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'login.html';
        return;
    }

    // Load user Details
    try {
        const user = await fetchAPI('/users/profile', 'GET', null, true);
        nameInput.value = user.name;
        emailInput.value = user.email;
    } catch (error) {
        showMessage(profileMessage, error.message);
    }

    // Load Orders
    loadMyOrders();
});

const loadMyOrders = async () => {
    showLoader(ordersLoader);
    hideMessage(ordersMessage);
    ordersTable.style.display = 'none';

    try {
        const orders = await fetchAPI('/orders/myorders', 'GET', null, true);

        if (orders.length === 0) {
            showMessage(ordersMessage, 'You have no orders', 'info');
        } else {
            ordersBody.innerHTML = '';
            orders.forEach(order => {
                const date = new Date(order.createdAt).toISOString().substring(0, 10);

                const isPaidHtml = order.isPaid
                    ? `<span class="badge-status status-success">${order.paidAt.substring(0, 10)}</span>`
                    : '<span class="badge-status status-danger"><i class="fas fa-times"></i></span>';

                const isDeliveredHtml = order.isDelivered
                    ? `<span class="badge-status status-success">${order.deliveredAt.substring(0, 10)}</span>`
                    : '<span class="badge-status status-danger"><i class="fas fa-times"></i></span>';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order._id.substring(0, 10)}...</td>
                    <td>${date}</td>
                    <td>₹${order.totalPrice}</td>
                    <td>${isPaidHtml}</td>
                    <td>${isDeliveredHtml}</td>
                    <td><a href="order.html?id=${order._id}" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">Details</a></td>
                `;
                ordersBody.appendChild(tr);
            });
            ordersTable.style.display = 'table';
        }
    } catch (error) {
        showMessage(ordersMessage, error.message);
    } finally {
        hideLoader(ordersLoader);
    }
};

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage(profileMessage);

    if (passwordInput.value !== confirmPasswordInput.value) {
        showMessage(profileMessage, 'Passwords do not match');
        return;
    }

    const originalBtnText = updateBtn.textContent;
    updateBtn.textContent = 'Updating...';
    updateBtn.disabled = true;

    try {
        const bodyDate = {
            name: nameInput.value,
            email: emailInput.value
        };

        if (passwordInput.value) {
            bodyDate.password = passwordInput.value;
        }

        const data = await fetchAPI('/users/profile', 'PUT', bodyDate, true);

        // Update local storage
        localStorage.setItem('userInfo', JSON.stringify(data));

        showMessage(profileMessage, 'Profile Updated Successfully', 'success');
        updateNavAuth(); // Refresh navbar

        // Clear password fields
        passwordInput.value = '';
        confirmPasswordInput.value = '';

    } catch (error) {
        showMessage(profileMessage, error.message);
    } finally {
        updateBtn.textContent = originalBtnText;
        updateBtn.disabled = false;
    }
});
