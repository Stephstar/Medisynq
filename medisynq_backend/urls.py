"""
URL configuration for medisynq_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('medisynq_backend.users.urls')),
    path('api/vitals/', include('medisynq_backend.vitals.urls')),
    path('api/appointments/', include('medisynq_backend.appointments.urls')),
    path('api/patients/', include('medisynq_backend.patients.urls')),
    path('api/consultations/', include('medisynq_backend.consultations.urls')),
    path('api/medications/', include('medisynq_backend.medications.urls')),
]
