from medisynq_backend.users.models import User
from medisynq_backend.medications.models import Medication
from medisynq_backend.medications.serializers import MedicationSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
class PatientListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'detail': 'Not authorized.'}, status=403)
        patients = User.objects.filter(role='patient')
        data = [
            {'id': p.id, 'username': p.username, 'dob': p.dob, 'contact': p.contact}
            for p in patients
        ]
        return Response(data)

class PrescribeMedicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        if request.user.role != 'doctor':
            return Response({'detail': 'Not authorized.'}, status=403)
        serializer = MedicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
from rest_framework import generics, permissions
from .models import PatientProfile
from .serializers import PatientProfileSerializer
from medisynq_backend.appointments.models import Appointment
from medisynq_backend.users.models import User

class PatientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return PatientProfile.objects.get(user=self.request.user)

class DoctorPatientListView(generics.ListAPIView):
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            patient_ids = Appointment.objects.filter(doctor=user).values_list('patient', flat=True).distinct()
            return PatientProfile.objects.filter(user__id__in=patient_ids)
        return PatientProfile.objects.none()
