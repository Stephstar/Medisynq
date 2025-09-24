document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch patients for doctor
    fetch('http://127.0.0.1:8000/api/patients/doctor-patient-list/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(patients => {
        const patientSelect = document.getElementById('patientSelect');
        patients.forEach(p => {
            patientSelect.innerHTML += `<option value="${p.id}">${p.username} (${p.email})</option>`;
        });
    });

    // On patient select, fetch EHR and adherence
    document.getElementById('patientSelect').addEventListener('change', function() {
        const patientId = this.value;
        if (!patientId) return;
        // Fetch EHR
        fetch(`http://127.0.0.1:8000/api/patients/ehr/${patientId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(ehr => {
            document.getElementById('ehrDisplay').textContent = ehr.detail || JSON.stringify(ehr, null, 2);
        });
        // Fetch adherence
        fetch(`http://127.0.0.1:8000/api/medications/adherence/${patientId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(adherence => {
            document.getElementById('adherenceDisplay').textContent = adherence.detail || JSON.stringify(adherence, null, 2);
        });
    });

    // Prescribe medication
    document.getElementById('prescribeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const patientId = document.getElementById('patientSelect').value;
        const medication = document.getElementById('medication').value;
        const instructions = document.getElementById('instructions').value;
        if (!patientId) {
            document.getElementById('prescribeMessage').textContent = 'Select a patient first.';
            return;
        }
        fetch('http://127.0.0.1:8000/api/patients/prescribe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ patient: patientId, medication, instructions })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            document.getElementById('prescribeMessage').textContent = ok ? 'Medication prescribed!' : (data.detail || 'Prescription failed.');
        });
    });
});
