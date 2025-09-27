// Example: Show role-based dashboard features
// You should store JWT token after login and use it for API requests
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem(JWT_KEY); // Use JWT_KEY from config.js
    const roleMessageDiv = document.getElementById('roleMessage');
    const dashboardFeaturesDiv = document.getElementById('dashboardFeatures');

    if (!token) {
        if (roleMessageDiv) roleMessageDiv.textContent = 'Please login to view your dashboard.';
        // Clear dashboard features if not logged in
        if (dashboardFeaturesDiv) dashboardFeaturesDiv.innerHTML = '';
        return;
    }

    fetch(`${API_BASE}users/profile/`, { // Aligned API URL
        headers: authHeaders() // Use authHeaders from config.js
    })
    .then(res => res.json())
    .then(data => {
        if (data.role === 'doctor') {
            if (roleMessageDiv) roleMessageDiv.textContent = 'Doctor Dashboard';
            if (dashboardFeaturesDiv) dashboardFeaturesDiv.innerHTML = `
                <ul>
                    <li><a href="appointments.html">Manage Appointments</a></li>
                    <li><a href="patients.html">View Patients</a></li>
                    <li><a href="consultations.html">Consultations</a></li>
                    <li><a href="profile.html">Profile</a></li>
                    <li><a href="doctor_dashboard.html">Doctor Specific Dashboard</a></li>
                </ul>
            `;
        } else {
            if (roleMessageDiv) roleMessageDiv.textContent = 'Patient Dashboard';
            if (dashboardFeaturesDiv) dashboardFeaturesDiv.innerHTML = `
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
        if (roleMessageDiv) roleMessageDiv.textContent = 'Error loading dashboard.';
        if (dashboardFeaturesDiv) dashboardFeaturesDiv.innerHTML = '';
    });
});