document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const response = await fetch('http://127.0.0.1:8000/api/users/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('forgotPasswordMessage').textContent = 'Password reset link sent to your email.';
    } else {
        document.getElementById('forgotPasswordMessage').textContent = data.detail || 'Failed to send reset link.';
    }
});
