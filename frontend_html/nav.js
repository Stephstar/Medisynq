// Dynamically render navigation links based on login status
function renderNav() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    const token = localStorage.getItem('access');
    if (token) {
        // Fetch user role for role-based nav
        fetch('http://127.0.0.1:8000/api/users/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            let links = `<a href="index.html">Home</a>
                <a href="dashboard.html">Dashboard</a>
                <a href="profile.html">Profile</a>
                <a href="vitals.html">Vitals</a>
                <a href="appointments.html">Appointments</a>`;
            if (data.role === 'doctor') {
                links += `<a href="doctor_dashboard.html">Doctor Dashboard</a>
                    <a href="patients.html">Patients</a>`;
            }
            links += `<a href="consultations.html">Consultations</a>
                <a href="#" onclick="logout()">Logout</a>`;
            nav.innerHTML = links;
        });
    } else {
        nav.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
            <a href="consultations.html">Consultations</a>
        `;
    }
}
function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = 'login.html';
}
document.addEventListener('DOMContentLoaded', renderNav);