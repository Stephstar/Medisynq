// frontend_html/patients.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem(JWT_KEY);
  const msg = document.getElementById('patientsMessage');
  if (!token) { if (msg) msg.textContent = 'Please login to view patients.'; return; }

  const res = await fetch(`${API_BASE}patients/doctor-list/`, { headers: authHeaders() });
  if (res.ok) {
    const patients = await res.json();
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = '';
    patients.forEach(p => {
      tbody.innerHTML += `<tr><td>${p.id}</td><td>${p.username || p.full_name}</td><td><a href="patient_detail.html?patient=${p.id}">View</a></td></tr>`;
    });
  } else {
    msg.textContent = 'Failed to load patients';
  }
});
