const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const messageDiv = document.getElementById('message');
const registerBtn = document.getElementById('registerBtn');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage(messageDiv);

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        showMessage(messageDiv, 'Passwords do not match');
        return;
    }

    const originalBtnText = registerBtn.textContent;
    registerBtn.textContent = 'Registering...';
    registerBtn.disabled = true;

    try {
        const data = await fetchAPI('/users', 'POST', { name, email, password });

        // Save to local storage
        localStorage.setItem('userInfo', JSON.stringify(data));

        // Redirect to home
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') ? urlParams.get('redirect') : '../index.html';

        window.location.href = redirect;

    } catch (error) {
        showMessage(messageDiv, error.message);
        registerBtn.textContent = originalBtnText;
        registerBtn.disabled = false;
    }
});
