// frontend_html/register.js
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const body = {};
  formData.forEach((v,k) => body[k] = v);

  const res = await fetch(`${API_BASE}users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok) {
    document.getElementById('registerMessage').textContent = 'Registration successful! Redirecting...';
    setTimeout(() => {
      if (data.role === 'doctor') window.location.href = 'doctor_dashboard.html';
      else window.location.href = 'dashboard.html';
    }, 1000);
  } else {
    document.getElementById('registerMessage').textContent = (data.detail || JSON.stringify(data)) || 'Registration failed';
  }
});
