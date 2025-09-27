// frontend_html/appointments.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(JWT_KEY);
  const msg = document.getElementById('appointmentMessage');
  if (!token) { if (msg) msg.textContent = 'Please login to manage appointments.'; return; }

  // load doctors
  fetch(`${API_BASE}users/doctor-list/`, { headers: authHeaders() })
    .then(r => r.json())
    .then(docs => {
      const sel = document.getElementById('doctor');
      if (!sel) return;
      sel.innerHTML = '<option value="">Choose doctor</option>';
      docs.forEach(d => sel.innerHTML += `<option value="${d.id}">${d.username} ${d.specialization ? '('+d.specialization+')' : ''}</option>`);
    }).catch(() => { if (msg) msg.textContent = 'Failed to load doctors.'; });

  // load appointments and render table
  async function loadAppointments() {
    const r = await fetch(`${API_BASE}appointments/`, { headers: authHeaders() });
    if (!r.ok) { if (msg) msg.textContent = 'Could not load appointments'; return; }
    const list = await r.json();
    const tbody = document.querySelector('#appointmentsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach(a => {
      // Corrected to show doctor username from the nested doctor object
      tbody.innerHTML += `<tr><td>${a.doctor.username || 'N/A'}</td><td>${new Date(a.scheduled_time).toLocaleString()}</td><td>${a.status}</td><td>${a.notes || ''}</td></tr>`;
    });
  }
  loadAppointments();

  document.getElementById('appointmentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const doc = document.getElementById('doctor').value;
    let scheduled = document.getElementById('scheduled_time').value;
    if (!doc || !scheduled) { if (msg) msg.textContent = 'Doctor and datetime required'; return; }
    scheduled = new Date(scheduled).toISOString();

    // pre-check with backend
    const chk = await fetch(`${API_BASE}appointments/check-availability/?doctor=${doc}&scheduled_time=${encodeURIComponent(scheduled)}`, { headers: authHeaders() });
    const jsonChk = await chk.json();
    if (!chk.ok || jsonChk.available === false) {
      if (msg) msg.textContent = jsonChk.detail || 'Doctor not available';
      return;
    }

    const res = await fetch(`${API_BASE}appointments/book/`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ doctor: doc, scheduled_time: scheduled })
    });
    const data = await res.json();
    if (res.ok) {
      if (msg) msg.textContent = 'Booked successfully';
      // Clear form fields
      document.getElementById('doctor').value = '';
      document.getElementById('scheduled_time').value = '';
      setTimeout(() => loadAppointments(), 800);
    } else {
      if (msg) msg.textContent = data.detail || JSON.stringify(data) || 'Booking failed';
    }
  });
});