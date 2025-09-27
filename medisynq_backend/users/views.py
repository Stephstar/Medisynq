from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer, RegisterSerializer
import logging

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            logger.debug(f"Received registration data: {request.data}")
            serializer = RegisterSerializer(data=request.data)  # Use RegisterSerializer
            if serializer.is_valid():
                user = serializer.save()
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                logger.debug(f"User registered: {serializer.data}")
                return Response({
                    "detail": "Registration successful",
                    "access": access_token,
                    "refresh": str(refresh),
                    "role": user.role
                }, status=status.HTTP_201_CREATED)
            logger.warning(f"Registration failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}", exc_info=True)
            return Response({"detail": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)