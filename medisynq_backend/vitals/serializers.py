from rest_framework import serializers
from .models import VitalRecord

class VitalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalRecord
        fields = ('id', 'user', 'vital_type', 'value', 'timestamp')
        read_only_fields = ('user', 'timestamp')