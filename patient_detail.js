// frontend_html/patient_detail.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem(JWT_KEY);
  const msg = document.getElementById('patientDetailMessage');
  if (!token) { if (msg) msg.textContent = 'Please login'; return; }

  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('patient');

  // Load vitals
  const vitalsRes = await fetch(`${API_BASE}vitals/?patient=${patientId}`, { headers: authHeaders() });
  if (vitalsRes.ok) {
    const vitals = await vitalsRes.json();
    const tbody = document.querySelector('#vitalsTable tbody');
    tbody.innerHTML = '';
    vitals.forEach(v => {
      tbody.innerHTML += `<tr><td>${v.timestamp}</td><td>${v.vital_type}</td><td>${v.value}</td></tr>`;
    });
  }

  // Load medication adherence
  const medsRes = await fetch(`${API_BASE}medications/adherence/${patientId}/`, { headers: authHeaders() });
  if (medsRes.ok) {
    const meds = await medsRes.json();
    const tbody = document.querySelector('#medicationsTable tbody');
    tbody.innerHTML = '';
    meds.forEach(m => {
      tbody.innerHTML += `<tr><td>${m.medication}</td><td>${m.dosage}</td><td>${m.adherence}</td></tr>`;
    });
  }
});
