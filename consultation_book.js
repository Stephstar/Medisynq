document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Fetch doctor list
    fetch('http://127.0.0.1:8000/api/users/doctor-list/', {
        headers: { 'Authorization': `Bearer ${token}` }
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
        if (scheduled_time) {
            scheduled_time = new Date(scheduled_time).toISOString();
        }
        const response = await fetch('http://127.0.0.1:8000/api/consultations/book/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ doctor, reason, scheduled_time })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('consultationMessage').textContent = 'Consultation booked!';
        } else {
            document.getElementById('consultationMessage').textContent = data.detail || 'Booking failed.';
        }
    });
});
