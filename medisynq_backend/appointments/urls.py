from django.urls import path
from .views import (
    AppointmentListCreateView,
    AppointmentDetailView,
    BookAppointmentView,
    check_availability,
)

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('book/', BookAppointmentView.as_view(), name='book-appointment'),
    path('check-availability/', check_availability, name='check-availability'),
]
