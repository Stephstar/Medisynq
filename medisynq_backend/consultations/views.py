from rest_framework import generics, permissions, serializers
from .models import Consultation
from .serializers import ConsultationSerializer

class ConsultationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Consultation.objects.filter(patient=user).order_by('-scheduled_time')
        elif user.role == 'doctor':
            return Consultation.objects.filter(doctor=user).order_by('-scheduled_time')
        return Consultation.objects.none()

    def perform_create(self, serializer):
        doctor = self.request.data.get('doctor')
        scheduled_time = self.request.data.get('scheduled_time')
        from django.utils.dateparse import parse_datetime
        from medisynq_backend.users.models import User
        doctor_obj = User.objects.filter(id=doctor, role='doctor').first()
        if not doctor_obj:
            raise serializers.ValidationError({'doctor': 'Doctor not found.'})
        overlap = Consultation.objects.filter(doctor=doctor_obj, scheduled_time=scheduled_time).exists()
        if overlap:
            raise serializers.ValidationError({'detail': 'Doctor is not available at this time.'})
        serializer.save(patient=self.request.user)

class ConsultationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Consultation.objects.all()
