const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage(messageDiv);

    const email = emailInput.value;
    const password = passwordInput.value;

    const originalBtnText = loginBtn.textContent;
    loginBtn.textContent = 'Signing In...';
    loginBtn.disabled = true;

    try {
        const data = await fetchAPI('/users/login', 'POST', { email, password });

        // Save to local storage
        localStorage.setItem('userInfo', JSON.stringify(data));

        // Redirect to home or redirect URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') ? urlParams.get('redirect') : '../index.html';

        window.location.href = redirect;

    } catch (error) {
        showMessage(messageDiv, error.message);
        loginBtn.textContent = originalBtnText;
        loginBtn.disabled = false;
    }
});
