<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Medisynq</title>
  <link rel="stylesheet" href="styles.css">
  <script src="config.js"></script>
  <script src="nav.js" defer></script>
</head>
<body>
  <header>
    <h1>Medisynq Telemedicine Platform</h1>
    <nav id="mainNav"></nav>
  </header>

  <main>
    <section id="dashboardContent">
      <h2>Dashboard</h2>
      <div id="roleMessage"></div>
      <div id="dashboardFeatures"></div>
    </section>
  </main>
</body>
</html>

  <footer>
    <p>&copy; 2025 Medisynq</p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const roleMessage = document.getElementById('roleMessage');
      const featuresDiv = document.getElementById('dashboardFeatures');

      const token = localStorage.getItem(JWT_KEY);
      if (!token) {
        roleMessage.textContent = 'You are not logged in. Please log in to access the dashboard.';
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || 'patient'; // Default to 'patient' if undefined

      if (role === 'doctor') {
        roleMessage.textContent = 'Welcome, Doctor! You can manage your patients and appointments.';
        featuresDiv.innerHTML = `
          <div class="feature-card" onclick="window.location.href='patients.html'">View Patients 👥</div>
          <div class="feature-card" onclick="window.location.href='appointments.html'">Manage Appointments 📅</div>
          <div class="feature-card" onclick="window.location.href='prescribe.html'">Prescribe Medication 💊</div>
        `;
      } else if (role === 'patient') {
        roleMessage.textContent = 'Welcome, Patient! You can view your health records and appointments.';
        featuresDiv.innerHTML = `
          <div class="feature-card" onclick="window.location.href='patient_detail.html'">View EHR 📋</div>
          <div class="feature-card" onclick="window.location.href='appointments.html'">Book Appointments 📅</div>
        `;
      } else {
        roleMessage.textContent = 'Unknown role. Please contact support.';
      }
    });
  </script>