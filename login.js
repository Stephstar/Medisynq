document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_BASE}users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok && data.access) {
    localStorage.setItem(JWT_KEY, data.access);
    try {
      const profileRes = await fetch(`${API_BASE}users/profile/`, { headers: authHeaders() });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        const role = profile.role || 'patient';
        if (role === 'doctor') window.location.href = 'doctor_dashboard.html';
        else window.location.href = 'dashboard.html';
        return;
      }
    } catch (err) {}
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('loginMessage').textContent = data.detail || 'Login failed';
  }
});
