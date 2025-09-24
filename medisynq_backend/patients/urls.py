from django.urls import path
from .views import PatientProfileView, DoctorPatientListView, PatientListView, PrescribeMedicationView

urlpatterns = [
    path('profile/', PatientProfileView.as_view(), name='patient-profile'),
    path('doctor-list/', DoctorPatientListView.as_view(), name='doctor-patient-list'),
    path('doctor-patient-list/', PatientListView.as_view(), name='doctor-patient-list'),
    path('prescribe/', PrescribeMedicationView.as_view(), name='prescribe-medication'),
]
