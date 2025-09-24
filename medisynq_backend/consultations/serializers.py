from rest_framework import serializers
from .models import Consultation

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ('id', 'patient', 'doctor', 'scheduled_time', 'jitsi_url', 'whatsapp_number', 'notes', 'created_at')
        read_only_fields = ('patient', 'created_at')