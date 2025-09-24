from django.apps import AppConfig

class ConsultationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'medisynq_backend.consultations'

    def ready(self):
        import medisynq_backend.consultations.signals
