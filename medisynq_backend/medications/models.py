from django.db import models
from medisynq_backend.users.models import User

class Medication(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medications', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescribed_medications', limit_choices_to={'role': 'doctor'})
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    instructions = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    adherence = models.BooleanField(default=False)  # Patient ticks if taken
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} for {self.patient.username} by {self.doctor.username}"