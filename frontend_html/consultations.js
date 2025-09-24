const token = localStorage.getItem('access');
if (!token) {
    document.getElementById('consultationMessage').textContent = 'Please login to book/view consultations.';
} else {
    // Load consultations
    fetch('http://127.0.0.1:8000/api/consultations/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#consultationsTable tbody');
        tbody.innerHTML = '';
        data.forEach(c => {
            const jitsiLink = c.jitsi_url ? `<a href="${c.jitsi_url}" target="_blank">Jitsi</a>` : '';
            const whatsappLink = c.whatsapp_number ? `<a href="https://wa.me/${c.whatsapp_number}" target="_blank">WhatsApp</a>` : '';
            const row = `<tr><td>${c.doctor}</td><td>${c.scheduled_time}</td><td>${jitsiLink} ${whatsappLink}</td><td>${c.notes}</td></tr>`;
            tbody.innerHTML += row;
        });
    });
}
document.getElementById('consultationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!token) return;
    const doctor = document.getElementById('doctor').value;
    const scheduled_time = document.getElementById('scheduled_time').value;
    const whatsapp_number = document.getElementById('whatsapp_number').value;
    // Generate Jitsi room URL (simple example)
    const jitsi_url = `https://meet.jit.si/medisynq-${doctor}-${Date.now()}`;
    const response = await fetch('http://127.0.0.1:8000/api/consultations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctor, scheduled_time, whatsapp_number, jitsi_url })
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('consultationMessage').textContent = 'Consultation booked!';
        window.location.reload();
    } else {
        document.getElementById('consultationMessage').textContent = data.detail || 'Booking failed.';
    }
});
function startJitsiCall() {
    const room = document.getElementById('jitsiRoom').value;
    if (!room) return;
    const container = document.getElementById('jitsiContainer');
    container.innerHTML = `<iframe src="https://meet.jit.si/${room}" style="width:100%;height:500px;border:0;"></iframe>`;
}
