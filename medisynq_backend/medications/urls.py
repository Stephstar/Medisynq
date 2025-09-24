from django.urls import path
from .views import MedicationListCreateView, MedicationDetailView, AdherenceView

urlpatterns = [
    path('', MedicationListCreateView.as_view(), name='medication-list-create'),
    path('<int:pk>/', MedicationDetailView.as_view(), name='medication-detail'),
    path('adherence/<int:patient_id>/', AdherenceView.as_view(), name='medication-adherence'),
]