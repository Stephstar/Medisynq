from django.contrib.auth.models import AbstractUser
from django.db import models

from django.core import validators
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    username_validator = validators.RegexValidator(
        regex=r'^[\w.@+\- ]+$ ',
        message=_('Enter a valid username. This value may contain only letters, numbers, spaces, and @/./+/-/_ characters.'),
        code='invalid'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    dob = models.DateField(null=True, blank=True)
    contact = models.CharField(max_length=100, blank=True)
    # Doctor-specific fields
    specialization = models.CharField(max_length=100, blank=True)
    years_of_experience = models.PositiveIntegerField(null=True, blank=True)
    hospital = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
