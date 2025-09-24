from django.urls import path
from .views import AppointmentListCreateView, AppointmentDetailView, BookAppointmentView

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('book/', BookAppointmentView.as_view(), name='book-appointment'),
]
