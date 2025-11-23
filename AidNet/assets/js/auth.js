document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = new FormData(loginForm);
            const payload = {
                email: form.get('email'),
                password: form.get('password')
            };
            const res = await AidNet.post('login.php', payload);
            if (res.success) {
                AidNet.setAuth(res.data);
                window.location.href = 'dashboard.html';
            } else {
                loginMessage.textContent = res.error || 'Login failed';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = new FormData(registerForm);
            const payload = {
                name: form.get('name'),
                email: form.get('email'),
                password: form.get('password'),
                role: form.get('role')
            };
            const res = await AidNet.post('register.php', payload);
            registerMessage.textContent = res.success ? 'Registered successfully. Please login.' : (res.error || 'Registration failed');
        });
    }
});


