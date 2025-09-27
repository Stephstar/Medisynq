from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'dob', 'contact', 'specialization', 'years_of_experience', 'hospital')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    specialization = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False, allow_null=True)
    hospital = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'dob', 'contact', 'specialization', 'years_of_experience', 'hospital')

    def validate(self, data):
        if data.get('role') == 'doctor':
            if not data.get('specialization'):
                raise serializers.ValidationError({'specialization': 'This field is required for doctors.'})
            if not data.get('years_of_experience'):
                raise serializers.ValidationError({'years_of_experience': 'This field is required for doctors.'})
            if not data.get('hospital'):
                raise serializers.ValidationError({'hospital': 'This field is required for doctors.'})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            dob=validated_data.get('dob'),
            contact=validated_data.get('contact', ''),
            specialization=validated_data.get('specialization', ''),
            years_of_experience=validated_data.get('years_of_experience'),
            hospital=validated_data.get('hospital', '')
        )
        return user