from medisynq_backend.users.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
class BookAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        doctor_id = request.data.get('doctor')
        scheduled_time = request.data.get('scheduled_time')
        doctor = User.objects.filter(id=doctor_id, role='doctor').first()
        if not doctor:
            return Response({'detail': 'Doctor not found.'}, status=400)
        # Check for overlapping appointments
        from django.utils.dateparse import parse_datetime
        scheduled_dt = parse_datetime(scheduled_time)
        overlap = Appointment.objects.filter(doctor=doctor, scheduled_time=scheduled_time).exists()
        if overlap:
            return Response({'detail': 'Doctor is not available at this time.'}, status=400)
        appointment = Appointment.objects.create(
            patient=request.user,
            doctor=doctor,
            scheduled_time=scheduled_time
        )
        return Response({'id': appointment.id, 'doctor': doctor.username, 'scheduled_time': scheduled_time, 'status': appointment.status})
from rest_framework import generics, permissions
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user).order_by('-scheduled_time')
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user).order_by('-scheduled_time')
        return Appointment.objects.none()

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Appointment.objects.all()
