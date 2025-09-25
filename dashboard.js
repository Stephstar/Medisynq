// Example: Show role-based dashboard features
// You should store JWT token after login and use it for API requests
const token = localStorage.getItem('access');
if (!token) {
    document.getElementById('roleMessage').textContent = 'Please login to view your dashboard.';
} else {
    fetch('http://127.0.0.1:8000/api/users/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.role === 'doctor') {
            document.getElementById('roleMessage').textContent = 'Doctor Dashboard';
            document.getElementById('dashboardFeatures').innerHTML = `
                <ul>
                    <li><a href="appointments.html">Manage Appointments</a></li>
                    <li><a href="patients.html">View Patients</a></li>
                    <li><a href="consultations.html">Consultations</a></li>
                    <li><a href="profile.html">Profile</a></li>
                </ul>
            `;
        } else {
            document.getElementById('roleMessage').textContent = 'Patient Dashboard';
            document.getElementById('dashboardFeatures').innerHTML = `
                <ul>
                    <li><a href="appointments.html">Book/View Appointments</a></li>
                    <li><a href="vitals.html">Submit/View Vitals</a></li>
                    <li><a href="consultations.html">Consultations</a></li>
                    <li><a href="profile.html">Profile</a></li>
                </ul>
            `;
        }
    })
    .catch(() => {
        document.getElementById('roleMessage').textContent = 'Error loading dashboard.';
    });
}
