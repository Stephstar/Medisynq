from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from django.core.mail import send_mail
from django.utils import timezone
import threading

def send_email_later(subject, message_doctor, message_patient, doctor_email, patient_email, delay_seconds):
    def send():
        import time
        time.sleep(delay_seconds)
        send_mail(subject, message_doctor, 'noreply@medisynq.com', [doctor_email], fail_silently=True)
        send_mail(subject, message_patient, 'noreply@medisynq.com', [patient_email], fail_silently=True)
    threading.Thread(target=send).start()

@receiver(post_save, sender=Appointment)
def notify_doctor_appointment(sender, instance, created, **kwargs):
    if created and instance.status == 'scheduled':
        now = timezone.now()
        scheduled = instance.scheduled_time
        delay = (scheduled - now).total_seconds() - 1800  # 30 mins before
        if delay > 0:
            subject = 'Upcoming Appointment Reminder'
            message_doctor = f"You have an appointment with {instance.patient.username} at {scheduled}."
            message_patient = f"You have an appointment with {instance.doctor.username} at {scheduled}."
            send_email_later(subject, message_doctor, message_patient, instance.doctor.email, instance.patient.email, delay)
        