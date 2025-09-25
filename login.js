// frontend_html/login.js
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_BASE}users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok && data.access) {
    localStorage.setItem(JWT_KEY, data.access);
    // Fetch profile to determine role and redirect
    try {
      const profileRes = await fetch(`${API_BASE}users/profile/`, { headers: authHeaders() });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        const role = profile.role || 'patient';
        if (role === 'doctor') window.location.href = 'doctor_dashboard.html';
        else window.location.href = 'dashboard.html';
        return;
      }
    } catch (err) {
      // fallback
    }
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('loginMessage').textContent = data.detail || 'Login failed';
  }
});
