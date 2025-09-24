from rest_framework import generics, permissions
from medisynq_backend.users.models import User
from .models import Patient
from medisynq_backend.appointments.models import Appointment
from medisynq_backend.medications.models import Medication
from rest_framework.response import Response

class PatientEHRView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pk):
        # Only allow doctors to view
        if not request.user.role == 'doctor':
            return Response({'detail': 'Not authorized.'}, status=403)
        patient = User.objects.get(pk=pk, role='patient')
        appointments = Appointment.objects.filter(patient=patient)
        medications = Medication.objects.filter(patient=patient)
        # Example EHR data
        ehr = {
            'appointments': [
                {'id': a.id, 'doctor': a.doctor.username, 'scheduled_time': a.scheduled_time, 'status': a.status, 'notes': a.notes}
                for a in appointments
            ],
            'medications': [
                {'id': m.id, 'name': m.name, 'prescribed_by': m.doctor.username, 'start_date': m.start_date, 'end_date': m.end_date, 'adherence': m.adherence}
                for m in medications
            ]
        }
        return Response(ehr)
