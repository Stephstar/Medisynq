document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem(JWT_KEY); // Use JWT_KEY from config.js
    const consultationMessageDiv = document.getElementById('consultationMessage');

    if (!token) {
        if (consultationMessageDiv) consultationMessageDiv.textContent = 'Please login to book/view consultations.';
        return;
    }

    // Load consultations
    fetch(`${API_BASE}consultations/`, { // Aligned API URL
        headers: authHeaders() // Use authHeaders from config.js
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#consultationsTable tbody');
        if (!tbody) return; // Add null check
        tbody.innerHTML = '';
        data.forEach(c => {
            const jitsiLink = c.jitsi_url ? `<a href="${c.jitsi_url}" target="_blank">Jitsi</a>` : '';
            const whatsappLink = c.whatsapp_number ? `<a href="https://wa.me/${c.whatsapp_number}" target="_blank">WhatsApp</a>` : '';
            // Ensure doctor name is extracted correctly if 'doctor' is an object
            const doctorName = c.doctor?.username || c.doctor || 'N/A';
            const row = `<tr><td>${doctorName}</td><td>${new Date(c.scheduled_time).toLocaleString()}</td><td>${jitsiLink} ${whatsappLink}</td><td>${c.notes || ''}</td></tr>`;
            tbody.innerHTML += row;
        });
    })
    .catch(error => { // Add error handling
        console.error('Failed to load consultations:', error);
        if (consultationMessageDiv) consultationMessageDiv.textContent = 'Failed to load consultations.';
    });

    document.getElementById('consultationForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!token) {
            if (consultationMessageDiv) consultationMessageDiv.textContent = 'Please login to book consultations.';
            return;
        }

        const doctorId = document.getElementById('doctor').value; // Changed to doctorId as per backend
        let scheduled_time = document.getElementById('scheduled_time').value;
        const whatsapp_number = document.getElementById('whatsapp_number').value;

        if (!doctorId || !scheduled_time) {
            if (consultationMessageDiv) consultationMessageDiv.textContent = 'Doctor and Date & Time are required.';
            return;
        }
        scheduled_time = new Date(scheduled_time).toISOString();

        // Generate Jitsi room URL (simple example)
        const jitsi_url = `https://meet.jit.si/medisynq-${doctorId}-${Date.now()}`; // Use doctor ID for room

        const response = await fetch(`${API_BASE}consultations/`, { // Aligned API URL
            method: 'POST',
            headers: jsonHeaders(), // Use jsonHeaders from config.js
            body: JSON.stringify({ doctor: doctorId, scheduled_time, whatsapp_number, jitsi_url })
        });
        const data = await response.json();
        if (response.ok) {
            if (consultationMessageDiv) consultationMessageDiv.textContent = 'Consultation booked!';
            // Clear form fields
            document.getElementById('doctor').value = '';
            document.getElementById('scheduled_time').value = '';
            document.getElementById('whatsapp_number').value = '';
            // Reload consultations after successful booking
            // Re-fetch doctor list if necessary or rely on user selecting again
            fetch(`${API_BASE}users/doctor-list/`, { headers: authHeaders() }) // Re-load doctors for the select box in the form
                .then(r => r.json())
                .then(docs => {
                    const sel = document.getElementById('doctor');
                    if (!sel) return;
                    sel.innerHTML = '<option value="">Choose doctor</option>';
                    docs.forEach(d => sel.innerHTML += `<option value="${d.id}">${d.username} ${d.specialization ? '('+d.specialization+')' : ''}</option>`);
                }).catch(() => { if (consultationMessageDiv) consultationMessageDiv.textContent = 'Failed to reload doctors.'; });

            // Reload consultation list
            fetch(`${API_BASE}consultations/`, { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const tbody = document.querySelector('#consultationsTable tbody');
                if (!tbody) return;
                tbody.innerHTML = '';
                data.forEach(c => {
                    const jitsiLink = c.jitsi_url ? `<a href="${c.jitsi_url}" target="_blank">Jitsi</a>` : '';
                    const whatsappLink = c.whatsapp_number ? `<a href="https://wa.me/${c.whatsapp_number}" target="_blank">WhatsApp</a>` : '';
                    const doctorName = c.doctor?.username || c.doctor || 'N/A';
                    const row = `<tr><td>${doctorName}</td><td>${new Date(c.scheduled_time).toLocaleString()}</td><td>${jitsiLink} ${whatsappLink}</td><td>${c.notes || ''}</td></tr>`;
                    tbody.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Failed to reload consultations:', error);
                if (consultationMessageDiv) consultationMessageDiv.textContent = 'Failed to reload consultations.';
            });

        } else {
            if (consultationMessageDiv) consultationMessageDiv.textContent = data.detail || JSON.stringify(data) || 'Booking failed.';
        }
    });

    // Load doctors for the booking form
    fetch(`${API_BASE}users/doctor-list/`, { headers: authHeaders() })
    .then(r => r.json())
    .then(docs => {
      const sel = document.getElementById('doctor');
      if (!sel) return;
      sel.innerHTML = '<option value="">Choose doctor</option>';
      docs.forEach(d => sel.innerHTML += `<option value="${d.id}">${d.username} ${d.specialization ? '('+d.specialization+')' : ''}</option>`);
    }).catch(() => { if (consultationMessageDiv) consultationMessageDiv.textContent = 'Failed to load doctors for booking.'; });


    function startJitsiCall() {
        const room = document.getElementById('jitsiRoom').value;
        if (!room) {
            alert('Please enter a Jitsi Room Name.');
            return;
        }
        const container = document.getElementById('jitsiContainer');
        container.innerHTML = `<iframe src="https://meet.jit.si/${room}" style="width:100%;height:500px;border:0;"></iframe>`;
    }
    // Make startJitsiCall globally accessible as it's called from HTML
    window.startJitsiCall = startJitsiCall;
});