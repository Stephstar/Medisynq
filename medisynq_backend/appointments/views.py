from medisynq_backend.users.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, generics
from .models import Appointment
from .serializers import AppointmentSerializer
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes


class BookAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        doctor_id = request.data.get('doctor')
        scheduled_time = request.data.get('scheduled_time')

        # validate doctor
        doctor = User.objects.filter(id=doctor_id, role='doctor').first()
        if not doctor:
            return Response({'detail': 'Doctor not found.'}, status=400)

        # parse datetime string properly
        scheduled_dt = parse_datetime(scheduled_time)
        if scheduled_dt is None:
            return Response({'detail': 'Invalid scheduled_time format.'}, status=400)

        # overlap check: assume 30 minute slot around scheduled time
        slot = timedelta(minutes=30)
        window_start = scheduled_dt - slot
        window_end = scheduled_dt + slot

        overlap = Appointment.objects.filter(
            doctor=doctor,
            scheduled_time__gte=window_start,
            scheduled_time__lte=window_end,
            status__in=['scheduled', 'completed']  # block if already booked
        ).exists()

        if overlap:
            return Response({'detail': 'Doctor is not available at this time.'}, status=400)

        appointment = Appointment.objects.create(
            patient=request.user,
            doctor=doctor,
            scheduled_time=scheduled_dt
        )
        return Response(
            {
                'id': appointment.id,
                'doctor': doctor.username,
                'scheduled_time': scheduled_dt.isoformat(),
                'status': appointment.status
            },
            status=201
        )


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user).order_by('-scheduled_time')
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user).order_by('-scheduled_time')
        return Appointment.objects.none()

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class AppointmentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Appointment.objects.all()


# New endpoint: check availability
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_availability(request):
    doctor_id = request.query_params.get('doctor')
    scheduled = request.query_params.get('scheduled_time')

    if not doctor_id or not scheduled:
        return Response({'detail': 'doctor and scheduled_time required'}, status=400)

    scheduled_dt = parse_datetime(scheduled)
    if scheduled_dt is None:
        return Response({'detail': 'Invalid scheduled_time format'}, status=400)

    slot = timedelta(minutes=30)
    window_start = scheduled_dt - slot
    window_end = scheduled_dt + slot

    conflict = Appointment.objects.filter(
        doctor_id=doctor_id,
        scheduled_time__gte=window_start,
        scheduled_time__lte=window_end,
        status__in=['scheduled', 'completed']
    ).exists()

    return Response({'available': not conflict})
