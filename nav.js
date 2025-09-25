// frontend_html/nav.js
document.addEventListener('DOMContentLoaded', async () => {
  const navHolder = document.getElementById('main-nav');
  const token = localStorage.getItem(JWT_KEY);
  let html = '';

  if (token) {
    try {
      const profileRes = await fetch(`${API_BASE}users/profile/`, { headers: authHeaders() });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        const role = profile.role || 'patient';
        html = `
          <a href="dashboard.html">Dashboard</a>
          ${role === 'doctor' ? '<a href="doctor_dashboard.html">Doctor</a>' : ''}
          <a href="patients.html">Patients</a>
          <a href="appointments.html">Appointments</a>
          <a href="vitals.html">Vitals</a>
          <a href="#" id="logout">Logout</a>
        `;
      } else {
        html = `<a href="dashboard.html">Dashboard</a><a href="#" id="logout">Logout</a>`;
      }
    } catch (e) {
      html = `<a href="dashboard.html">Dashboard</a><a href="#" id="logout">Logout</a>`;
    }
  } else {
    html = `<a href="index.html">Home</a><a href="login.html">Login</a><a href="register.html">Register</a>`;
  }

  if (navHolder) navHolder.innerHTML = html;

  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(JWT_KEY);
      window.location.href = 'login.html';
    });
  }
});
