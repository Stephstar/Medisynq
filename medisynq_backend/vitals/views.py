from rest_framework import generics, permissions, serializers
from .models import VitalRecord
from .serializers import VitalRecordSerializer


class VitalRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = VitalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient')

        if user.role == 'doctor' and patient_id:
            return VitalRecord.objects.filter(user_id=patient_id).order_by('-timestamp')
        elif user.role == 'doctor':
            return VitalRecord.objects.all().order_by('-timestamp')
        else:  # patient
            return VitalRecord.objects.filter(user=user).order_by('-timestamp')

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'doctor':
            patient_id = self.request.data.get('patient')
            if patient_id:
                serializer.save(user_id=patient_id)
            else:
                raise serializers.ValidationError({'detail': 'Patient ID required for doctor entry.'})
        else:
            # patient → always save for themselves
            serializer.save(user=user)


class VitalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VitalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = VitalRecord.objects.all()
