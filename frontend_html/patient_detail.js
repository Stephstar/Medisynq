// frontend_html/patient_detail.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem(JWT_KEY);
    const message = document.getElementById('ehrMessage');
    if (!token) {
        message.textContent = 'Please login to view EHR.';
        return;
    }

    // Get patient ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient');
    if (!patientId) {
        message.textContent = 'Patient ID missing.';
        return;
    }

    // Fetch and display Appointments
    try {
        const appRes = await fetch(`${API_BASE}appointments/?patient=${patientId}`, { headers: authHeaders() });
        if (appRes.ok) {
            const apps = await appRes.json();
            const appTbody = document.querySelector('#appointmentsTable tbody');
            appTbody.innerHTML = '';
            apps.forEach(a => {
                appTbody.innerHTML += `<tr><td>${a.id}</td><td>${a.scheduled_time}</td><td>${a.status}</td><td>${a.notes || ''}</td></tr>`;
            });
        }
    } catch (e) {
        message.textContent += ' Failed to load appointments.';
    }

    // Fetch and display Vitals
    try {
        const vitRes = await fetch(`${API_BASE}vitals/?patient=${patientId}`, { headers: authHeaders() });
        if (vitRes.ok) {
            const vitals = await vitRes.json();
            const vitTbody = document.querySelector('#vitalsTable tbody');
            vitTbody.innerHTML = '';
            vitals.forEach(v => {
                vitTbody.innerHTML += `<tr><td>${v.timestamp}</td><td>${v.vital_type}</td><td>${v.value}</td></tr>`;
            });
        }
    } catch (e) {
        message.textContent += ' Failed to load vitals.';
    }

    // Fetch and display Medications & Adherence
    try {
        const medRes = await fetch(`${API_BASE}medications/?patient=${patientId}`, { headers: authHeaders() });
        if (medRes.ok) {
            const meds = await medRes.json();
            const medTbody = document.querySelector('#medicationsTable tbody');
            medTbody.innerHTML = '';
            meds.forEach(m => {
                const adherence = m.adherence ? 'Adhered' : 'Not Adhered';
                medTbody.innerHTML += `<tr><td>${m.name}</td><td>${m.dosage}</td><td>${m.instructions}</td><td>${m.start_date} to ${m.end_date || 'Ongoing'}</td><td>${adherence}</td></tr>`;
            });
        }
    } catch (e) {
        message.textContent += ' Failed to load medications.';
    }
});