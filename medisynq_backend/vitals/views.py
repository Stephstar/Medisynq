from rest_framework import generics, permissions, serializers
from .models import VitalRecord
from .serializers import VitalRecordSerializer

class VitalRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = VitalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            patient_id = self.request.query_params.get('patient')
            if patient_id:
                return VitalRecord.objects.filter(user_id=patient_id).order_by('-timestamp')
            return VitalRecord.objects.none()
        return VitalRecord.objects.filter(user=user).order_by('-timestamp')

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'doctor':
            patient_id = self.request.data.get('patient')
            note = self.request.data.get('note', '')
            if patient_id:
                serializer.save(user_id=patient_id, note=note)
            else:
                raise serializers.ValidationError({'detail': 'Patient ID required for doctor entry.'})
        else:
            serializer.save(user=user)
