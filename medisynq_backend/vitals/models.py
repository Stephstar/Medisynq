from django.db import models
from medisynq_backend.users.models import User

class VitalRecord(models.Model):
    VITAL_TYPE_CHOICES = [
        ('bp', 'Blood Pressure'),
        ('hr', 'Heart Rate'),
        ('glucose', 'Glucose'),
        ('temp', 'Temperature'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vital_records')
    vital_type = models.CharField(max_length=10, choices=VITAL_TYPE_CHOICES)
    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.vital_type}: {self.value} @ {self.timestamp}"