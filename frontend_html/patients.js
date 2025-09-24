const token = localStorage.getItem('access');
if (!token) {
    document.getElementById('patientsTable').innerHTML = '<tr><td colspan="3">Please login as a doctor to view patients.</td></tr>';
} else {
    fetch('http://127.0.0.1:8000/api/patients/doctor-list/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#patientsTable tbody');
        tbody.innerHTML = '';
        data.forEach(patient => {
            const row = `<tr><td>${patient.user}</td><td>${patient.contact}</td><td>${patient.dob}</td></tr>`;
            tbody.innerHTML += row;
        });
    });
}
