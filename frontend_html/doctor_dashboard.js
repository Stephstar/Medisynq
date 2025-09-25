// frontend_html/doctor_dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem(JWT_KEY);
  if (!token) { window.location.href = 'login.html'; return; }

  // load patients for this doctor via patients/doctor-list/ (your patients view)
  const res = await fetch(`${API_BASE}patients/doctor-list/`, { headers: authHeaders() });
  if (!res.ok) { document.getElementById('doctorMessage').textContent = 'Failed to load patients'; return; }
  const patients = await res.json();
  const tbody = document.querySelector('#patientsTable tbody');
  tbody.innerHTML = '';
  patients.forEach(p => {
    tbody.innerHTML += `<tr>
      <td>${p.id}</td>
      <td>${p.user.username || p.user}</td>
      <td><a href="patient_detail.html?patient=${p.user.id}">View</a></td>
      <td><button class="prescribeBtn" data-id="${p.user.id}">Prescribe</button></td>
    </tr>`;
  });

  document.querySelectorAll('.prescribeBtn').forEach(b => {
    b.addEventListener('click', (e) => {
      const pid = e.target.dataset.id;
      window.location.href = `prescribe.html?patient=${pid}`;
    });
  });
});
