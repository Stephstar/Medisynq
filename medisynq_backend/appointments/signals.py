from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from django.core.mail import send_mail
from django.utils import timezone
import threading

def send_email_later(subject, message, recipient, delay_seconds):
    def send():
        import time
        time.sleep(delay_seconds)
        send_mail(subject, message, 'noreply@medisynq.com', [recipient], fail_silently=True)
    threading.Thread(target=send).start()

@receiver(post_save, sender=Appointment)
def notify_doctor_appointment(sender, instance, created, **kwargs):
    if created and instance.status == 'scheduled':
        now = timezone.now()
        scheduled = instance.scheduled_time
        delay = (scheduled - now).total_seconds() - 1800  # 30 mins before
        if delay > 0:
            subject = 'Upcoming Appointment Reminder'
            message = f"You have an appointment with {instance.patient.username} at {scheduled}."
            send_email_later(subject, message, instance.doctor.email, delay)
