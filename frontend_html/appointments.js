const token = localStorage.getItem('access');
if (!token) {
    document.getElementById('appointmentMessage').textContent = 'Please login to book/view appointments.';
} else {
    // Fetch doctor list for dropdown
    fetch('http://127.0.0.1:8000/api/users/doctor-list/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(doctors => {
        const doctorSelect = document.getElementById('doctor');
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doc => {
            doctorSelect.innerHTML += `<option value="${doc.id}">${doc.username} (${doc.specialization || ''}, ${doc.years_of_experience || ''} yrs, ${doc.hospital || ''})</option>`;
        });
    });

    // Load appointments
    fetch('http://127.0.0.1:8000/api/appointments/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#appointmentsTable tbody');
        tbody.innerHTML = '';
        if (!Array.isArray(data)) {
            document.getElementById('appointmentMessage').textContent = data.detail || 'Error loading appointments.';
            return;
        }
        data.forEach(app => {
            const row = `<tr><td>${app.doctor}</td><td>${app.scheduled_time}</td><td>${app.status}</td><td>${app.notes}</td></tr>`;
            tbody.innerHTML += row;
        });
    });
}
document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!token) return;
    const doctor = document.getElementById('doctor').value;
    let scheduled_time = document.getElementById('scheduled_time').value;
    if (scheduled_time) {
        scheduled_time = new Date(scheduled_time).toISOString();
    }
    const response = await fetch('http://127.0.0.1:8000/api/appointments/book/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctor, scheduled_time })
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('appointmentMessage').textContent = 'Appointment booked!';
    } else {
        document.getElementById('appointmentMessage').textContent = data.detail || 'Booking failed.';
    }
});
