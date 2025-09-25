// frontend_html/prescribe.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem(JWT_KEY);
    const message = document.getElementById('prescribeMessage');
    if (!token) {
        message.textContent = 'Please login to prescribe medications.';
        return;
    }

    // Get patient ID from URL query (e.g., ?patient=123)
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient');
    if (!patientId) {
        message.textContent = 'Patient ID missing. Return to dashboard.';
        return;
    }

    // Optional: Fetch and display patient name for context
    try {
        const patientRes = await fetch(`${API_BASE}patients/${patientId}/`, { headers: authHeaders() });
        if (patientRes.ok) {
            const patient = await patientRes.json();
            document.querySelector('h2').textContent = `Prescribe for ${patient.username || patient.user}`;
        }
    } catch (e) {
        console.error('Failed to load patient info');
    }

    document.getElementById('prescribeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const medication = document.getElementById('medication').value;
        const dosage = document.getElementById('dosage').value;
        const instructions = document.getElementById('instructions').value;
        const start_date = document.getElementById('start_date').value;
        const end_date = document.getElementById('end_date').value || null;

        if (!medication || !dosage || !instructions || !start_date) {
            message.textContent = 'All required fields must be filled.';
            return;
        }

        const payload = {
            patient: patientId,  // Attach patient ID for backend
            name: medication,
            dosage,
            instructions,
            start_date,
            end_date
        };

        const res = await fetch(`${API_BASE}medications/`, {
            method: 'POST',
            headers: jsonHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            message.textContent = 'Medication prescribed successfully!';
            // Optional: Redirect back to doctor_dashboard after 2s
            setTimeout(() => window.location.href = 'doctor_dashboard.html', 2000);
        } else {
            message.textContent = data.detail || 'Failed to prescribe medication.';
        }
    });
});