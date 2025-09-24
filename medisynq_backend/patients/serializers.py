from rest_framework import serializers
from .models import PatientProfile

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ('id', 'user', 'emergency_contact', 'address', 'insurance_info')
        read_only_fields = ('user',)