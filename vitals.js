// frontend_html/vitals.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem(JWT_KEY);
  const msg = document.getElementById('vitalsMessage');
  if (!token) { if (msg) msg.textContent = 'Login required'; return; }

  const profileRes = await fetch(`${API_BASE}users/profile/`, { headers: authHeaders() });
  const profile = (profileRes.ok) ? await profileRes.json() : null;
  const role = profile?.role || 'patient';

  if (role === 'doctor') {
    const patientSel = document.getElementById('patient');
    const pr = await fetch(`${API_BASE}patients/doctor-list/`, { headers: authHeaders() });
    if (pr.ok) {
      const patients = await pr.json();
      patientSel.innerHTML = '<option value="">Select patient</option>';
      patients.forEach(p => patientSel.innerHTML += `<option value="${p.id}">${p.username || p.full_name}</option>`);
    }
  } else {
    const patientRow = document.getElementById('patient-row');
    if (patientRow) patientRow.style.display = 'none';
  }

  document.getElementById('vitalsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bp = document.getElementById('bp').value;
    const hr = document.getElementById('heart_rate').value;
    const glucose = document.getElementById('glucose').value;
    const temp = document.getElementById('temperature').value;

    const payload = { bp, heart_rate: hr, glucose, temperature: temp };
    if (role === 'doctor') {
      const pid = document.getElementById('patient').value;
      if (!pid) { msg.textContent = 'Select a patient'; return; }
      payload.patient = pid;
    }

    const res = await fetch(`${API_BASE}vitals/`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      msg.textContent = 'Vitals saved';
    } else {
      msg.textContent = data.detail || JSON.stringify(data) || 'Failed to save vitals';
    }
  });

  async function loadVitals(patientId=null) {
    let url = `${API_BASE}vitals/`;
    if (patientId) url += `?patient=${patientId}`;
    const r = await fetch(url, { headers: authHeaders() });
    if (!r.ok) { msg.textContent = 'Failed to load vitals'; return; }
    const list = await r.json();
    const tbody = document.querySelector('#vitalsTable tbody');
    tbody.innerHTML = '';
    list.forEach(v => {
      tbody.innerHTML += `<tr><td>${v.timestamp || v.recorded_at || ''}</td><td>${v.vital_type}</td><td>${v.value}</td></tr>`;
    });
  }

  if (role === 'patient') loadVitals();
  else { document.getElementById('patient')?.addEventListener('change', (e) => loadVitals(e.target.value)); }
});
