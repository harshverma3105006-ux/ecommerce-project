const usersTableBody = document.getElementById('usersTableBody');
const loading = document.getElementById('loading');
const messageBox = document.getElementById('message');
const contentContainer = document.getElementById('contentContainer');

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadUsers();
});

const checkAdminAuth = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
        window.location.href = '../../index.html';
    }
};

const loadUsers = async () => {
    showLoader(loading);
    contentContainer.style.display = 'none';
    hideMessage(messageBox);

    try {
        const users = await fetchAPI('/users', 'GET', null, true);

        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const isAdminIcon = user.isAdmin
                ? '<i class="fas fa-check" style="color:var(--success-color);"></i>'
                : '<i class="fas fa-times" style="color:var(--danger-color);"></i>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user._id.substring(0, 8)}...</td>
                <td>${user.name}</td>
                <td><a href="mailto:${user.email}" style="color:var(--primary-color)">${user.email}</a></td>
                <td>${isAdminIcon}</td>
                <td>
                    <button class="btn btn-danger btn-sm" style="background:var(--danger-color); color:white; border:none;" onclick="deleteUser('${user._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });

        contentContainer.style.display = 'block';
    } catch (error) {
        showMessage(messageBox, error.message);
    } finally {
        hideLoader(loading);
    }
};

window.deleteUser = async (id) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo._id === id) {
        showMessage(messageBox, "You cannot delete yourself");
        return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await fetchAPI(`/users/${id}`, 'DELETE', null, true);
            showMessage(messageBox, 'User Deleted', 'success');
            loadUsers();
        } catch (error) {
            showMessage(messageBox, error.message);
        }
    }
};
