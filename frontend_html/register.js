document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const dob = document.getElementById('dob').value;
    const contact = document.getElementById('contact').value;
    let payload = { username, email, password, role, dob, contact };
    if (role === 'doctor') {
        const specialization = document.getElementById('specialization').value || '';
        const years_of_experience = parseInt(document.getElementById('years_of_experience').value) || 0;
        const hospital = document.getElementById('hospital').value || '';
        payload = { ...payload, specialization: String(specialization), years_of_experience, hospital: String(hospital) };
    }
        const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (response.ok && data.id) {
            document.getElementById('registerMessage').textContent = 'Registration successful! Redirecting...';
            setTimeout(() => {
                if (role === 'doctor') {
                    window.location.href = 'doctor_dashboard.html';
                } else if (role === 'patient') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1200);
        } else {
            if (data.detail) {
                document.getElementById('registerMessage').textContent = data.detail;
            } else {
                const errors = Object.entries(data)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n');
                document.getElementById('registerMessage').textContent = errors;
            }
        }
});