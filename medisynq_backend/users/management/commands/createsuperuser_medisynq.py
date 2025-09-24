from django.core.management.base import BaseCommand
from medisynq_backend.users.models import User

class Command(BaseCommand):
    help = 'Create a superuser for Medisynq platform'

    def handle(self, *args, **options):
        username = 'admin'
        email = 'admin@medisynq.com'
        password = 'admin123'
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password, role='doctor')
            self.stdout.write(self.style.SUCCESS('Superuser created: admin/admin123'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists.'))
