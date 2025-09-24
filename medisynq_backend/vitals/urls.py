from django.urls import path
from .views import VitalRecordListCreateView

urlpatterns = [
    path('', VitalRecordListCreateView.as_view(), name='vital-list-create'),
]
