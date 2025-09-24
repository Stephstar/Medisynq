from django.apps import AppConfig

class AppointmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'medisynq_backend.appointments'

    def ready(self):
        import medisynq_backend.appointments.signals
