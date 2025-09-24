const token = localStorage.getItem('access');
if (!token) {
    document.getElementById('vitalMessage').textContent = 'Please login to submit/view vitals.';
} else {
    // Load vitals history
    fetch('http://127.0.0.1:8000/api/vitals/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#vitalsTable tbody');
        tbody.innerHTML = '';
        data.forEach(vital => {
            const row = `<tr><td>${vital.vital_type}</td><td>${vital.value}</td><td>${vital.timestamp}</td></tr>`;
            tbody.innerHTML += row;
        });
    });
}
document.getElementById('vitalForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!token) return;
    const vital_type = document.getElementById('vital_type').value;
    const value = document.getElementById('value').value;
    const response = await fetch('http://127.0.0.1:8000/api/vitals/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vital_type, value })
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('vitalMessage').textContent = 'Vital submitted!';
    } else {
        document.getElementById('vitalMessage').textContent = data.detail || 'Submission failed.';
    }
});
