from rest_framework import generics, permissions
from .models import Medication
from .serializers import MedicationSerializer

class MedicationListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Medication.objects.filter(doctor=user)
        elif user.role == 'patient':
            return Medication.objects.filter(patient=user)
        return Medication.objects.none()

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class MedicationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Medication.objects.all()

# Medication adherence view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

class AdherenceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        User = get_user_model()
        try:
            patient = User.objects.get(id=patient_id, role='patient')
        except User.DoesNotExist:
            return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)
        meds = Medication.objects.filter(patient=patient)
        adherence_data = []
        for med in meds:
            adherence_data.append({
                'medication': med.name,
                'instructions': med.instructions,
                'prescribed_by': med.doctor.username if med.doctor else '',
                'adherence': med.adherence if hasattr(med, 'adherence') else 'N/A',
                'prescribed_on': med.created_at.isoformat() if hasattr(med, 'created_at') else ''
            })
        return Response(adherence_data)