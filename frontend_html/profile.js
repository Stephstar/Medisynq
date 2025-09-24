const token = localStorage.getItem('access');
if (!token) {
    document.getElementById('profileMessage').textContent = 'Please login to view your profile.';
} else {
    fetch('http://127.0.0.1:8000/api/users/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('username').value = data.username;
        document.getElementById('email').value = data.email;
        document.getElementById('dob').value = data.dob || '';
        document.getElementById('contact').value = data.contact || '';
        if (data.role === 'doctor') {
            document.getElementById('doctorFields').style.display = '';
            document.getElementById('specialization').value = data.specialization || '';
            document.getElementById('years_of_experience').value = data.years_of_experience || '';
            document.getElementById('hospital').value = data.hospital || '';
        }
    });
}
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!token) return;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const contact = document.getElementById('contact').value;
    const specialization = document.getElementById('specialization') ? document.getElementById('specialization').value : '';
    const years_of_experience = document.getElementById('years_of_experience') ? document.getElementById('years_of_experience').value : '';
    const hospital = document.getElementById('hospital') ? document.getElementById('hospital').value : '';
    const payload = { email, dob, contact, specialization, years_of_experience, hospital };
    const response = await fetch('http://127.0.0.1:8000/api/users/profile/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('profileMessage').textContent = 'Profile updated!';
    } else {
        document.getElementById('profileMessage').textContent = data.detail || 'Update failed.';
    }
});
