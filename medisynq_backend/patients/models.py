from django.db import models
from medisynq_backend.users.models import User

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255, blank=True)
    insurance_info = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Profile for {self.user.username}"