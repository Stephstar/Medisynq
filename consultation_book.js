document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem(JWT_KEY); // Use JWT_KEY from config.js
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Fetch doctor list
    fetch(`${API_BASE}users/doctor-list/`, { // Aligned API URL
        headers: authHeaders() // Use authHeaders from config.js
    })
    .then(res => res.json())
    .then(doctors => {
        const doctorSelect = document.getElementById('doctorSelect');
        doctors.forEach(doc => {
            doctorSelect.innerHTML += `<option value="${doc.id}">${doc.username} (${doc.specialization || ''}, ${doc.hospital || ''})</option>`;
        });
    });

    // Book consultation
    document.getElementById('consultationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const doctor = document.getElementById('doctorSelect').value;
        const reason = document.getElementById('reason').value;
        let scheduled_time = document.getElementById('scheduled_time').value;
        if (!scheduled_time) {
            document.getElementById('consultationMessage').textContent = 'Date & Time are required.';
            return;
        }
        scheduled_time = new Date(scheduled_time).toISOString();

        const response = await fetch(`${API_BASE}consultations/book/`, { // Assuming a book endpoint for consultations like appointments
            method: 'POST',
            headers: jsonHeaders(), // Use jsonHeaders from config.js
            body: JSON.stringify({ doctor, reason, scheduled_time })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('consultationMessage').textContent = 'Consultation booked!';
             // Clear form fields
            document.getElementById('doctorSelect').value = '';
            document.getElementById('reason').value = '';
            document.getElementById('scheduled_time').value = '';
        } else {
            document.getElementById('consultationMessage').textContent = data.detail || 'Booking failed.';
        }
    });
});