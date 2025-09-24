from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer, RegisterSerializer

class DoctorListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        doctors = User.objects.filter(role='doctor')
        data = [
            {
                'id': doc.id,
                'username': doc.username,
                'specialization': doc.specialization,
                'years_of_experience': doc.years_of_experience,
                'hospital': doc.hospital,
                'contact': doc.contact
            }
            for doc in doctors
        ]
        return Response(data)
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        email = request.data.get('email')
        User = get_user_model()
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'detail': 'Email not found.'}, status=status.HTTP_404_NOT_FOUND)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"http://127.0.0.1:8000/reset-password/{uid}/{token}/"
        send_mail(
            'Medisynq Password Reset',
            f'Click the link to reset your password: {reset_link}',
            'noreply@medisynq.com',
            [email],
            fail_silently=True,
        )
        return Response({'detail': 'Password reset link sent.'})
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserSerializer
