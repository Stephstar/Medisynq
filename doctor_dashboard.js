// frontend_html/doctor_dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem(JWT_KEY);
  const doctorMessageDiv = document.getElementById('doctorMessage'); // Assuming an element for messages

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Ensure this is a doctor's dashboard by checking the user's role
  try {
    const profileRes = await fetch(`${API_BASE}users/profile/`, { headers: authHeaders() });
    if (!profileRes.ok) {
        if (doctorMessageDiv) doctorMessageDiv.textContent = 'Failed to load profile. Please login again.';
        window.location.href = 'login.html';
        return;
    }
    const profile = await profileRes.json();
    if (profile.role !== 'doctor') {
        if (doctorMessageDiv) doctorMessageDiv.textContent = 'Access denied. This is a doctor-only page.';
        window.location.href = 'dashboard.html'; // Redirect non-doctors
        return;
    }
  } catch (e) {
      console.error("Error fetching profile:", e);
      if (doctorMessageDiv) doctorMessageDiv.textContent = 'Error verifying user role.';
      window.location.href = 'login.html';
      return;
  }

  // Load patients for this doctor
  const patientSelect = document.getElementById('patientSelect');
  if (patientSelect) {
      try {
          const res = await fetch(`${API_BASE}patients/doctor-list/`, { headers: authHeaders() }); // Aligned API URL
          if (!res.ok) {
              if (doctorMessageDiv) doctorMessageDiv.textContent = 'Failed to load patients.';
              return;
          }
          const patients = await res.json();
          patientSelect.innerHTML = '<option value="">Select Patient</option>'; // Clear existing options
          patients.forEach(p => {
            // patient.user might be an ID or an object, adapt based on actual API response
            const patientName = p.user?.username || p.user; // Assuming p.user is an object with username or directly the username string
            patientSelect.innerHTML += `<option value="${p.id}">${patientName}</option>`;
          });
      } catch (e) {
          console.error('Failed to load patients:', e);
          if (doctorMessageDiv) doctorMessageDiv.textContent = 'Failed to load patients.';
      }
  }

  // Event listener for patient selection to display EHR
  patientSelect?.addEventListener('change', async (e) => {
      const selectedPatientId = e.target.value;
      const ehrDisplay = document.getElementById('ehrDisplay');
      if (!selectedPatientId) {
          if (ehrDisplay) ehrDisplay.innerHTML = 'Select a patient to view EHR.';
          return;
      }
      if (ehrDisplay) ehrDisplay.innerHTML = 'Loading patient EHR...';

      // Redirect to patient_detail.html
      window.location.href = `patient_detail.html?patient=${selectedPatientId}`;
  });

  // Prescribe Medication form handling (if it's on this dashboard)
  document.getElementById('prescribeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const medication = document.getElementById('medication').value;
    const instructions = document.getElementById('instructions').value;
    const patientId = document.getElementById('patientSelect').value; // Get patient from select box

    const prescribeMessage = document.getElementById('prescribeMessage');

    if (!patientId) {
        if (prescribeMessage) prescribeMessage.textContent = 'Please select a patient to prescribe medication.';
        return;
    }
    if (!medication || !instructions) {
        if (prescribeMessage) prescribeMessage.textContent = 'Medication and instructions are required.';
        return;
    }

    const payload = {
        patient: patientId,
        name: medication,
        dosage: "As per instructions", // Simplified, as dosage is not in this form
        instructions,
        start_date: new Date().toISOString().split('T')[0] // Current date
    };

    try {
        const res = await fetch(`${API_BASE}medications/`, { // Aligned API URL
            method: 'POST',
            headers: jsonHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            if (prescribeMessage) prescribeMessage.textContent = 'Medication prescribed successfully!';
            // Clear form fields
            document.getElementById('medication').value = '';
            document.getElementById('instructions').value = '';
        } else {
            if (prescribeMessage) prescribeMessage.textContent = data.detail || JSON.stringify(data) || 'Failed to prescribe medication.';
        }
    } catch (e) {
        console.error('Error prescribing medication:', e);
        if (prescribeMessage) prescribeMessage.textContent = 'An error occurred while prescribing medication.';
    }
  });

  // Medication Adherence display (needs an endpoint to fetch adherence for the selected patient)
    // Medication Adherence display (needs an endpoint to fetch adherence for the selected patient)
  const adherenceSection = document.getElementById('adherenceSection');
  const adherenceTableBody = document.querySelector('#adherenceTable tbody');

  patientSelect?.addEventListener('change', async (e) => {
    const selectedPatientId = e.target.value;
    if (!selectedPatientId) {
      if (adherenceTableBody) adherenceTableBody.innerHTML = '';
      return;
    }

    if (adherenceSection) adherenceSection.style.display = 'block';
    if (adherenceTableBody) adherenceTableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
      const res = await fetch(`${API_BASE}medications/adherence/${selectedPatientId}/`, {
        headers: authHeaders()
      });
      if (!res.ok) {
        if (adherenceTableBody) adherenceTableBody.innerHTML = '<tr><td colspan="4">Failed to load adherence.</td></tr>';
        return;
      }
      const meds = await res.json();
      if (adherenceTableBody) {
        adherenceTableBody.innerHTML = '';
        meds.forEach(m => {
          adherenceTableBody.innerHTML += `
            <tr>
              <td>${m.medication || m.name}</td>
              <td>${m.dosage || '-'}</td>
              <td>${m.instructions || '-'}</td>
              <td>${m.adherence || 'Not Reported'}</td>
            </tr>
          `;
        });
      }
    } catch (e) {
      console.error('Error loading adherence:', e);
      if (adherenceTableBody) adherenceTableBody.innerHTML = '<tr><td colspan="4">Error loading adherence data.</td></tr>';
    }
  });
});
