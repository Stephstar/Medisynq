// frontend_html/prescribe.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(JWT_KEY);
  const msg = document.getElementById('message');
  if (!token) { if (msg) msg.textContent = 'Please login'; return; }

  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('patient');

  document.getElementById('prescribeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const medication = document.getElementById('medication').value;
    const dosage = document.getElementById('dosage').value;
    const adherence = document.getElementById('adherence').value;

    const res = await fetch(`${API_BASE}medications/`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ patient: patientId, medication, dosage, adherence })
    });
    const data = await res.json();
    if (res.ok) msg.textContent = 'Prescription saved!';
    else msg.textContent = data.detail || 'Failed to save prescription';
  });
});
