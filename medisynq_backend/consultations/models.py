from django.db import models
from medisynq_backend.users.models import User

class Consultation(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations_as_patient', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations_as_doctor', limit_choices_to={'role': 'doctor'})
    scheduled_time = models.DateTimeField()
    jitsi_url = models.URLField(blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consultation: {self.patient.username} with {self.doctor.username} @ {self.scheduled_time}"