# Samip Regmi
# Signup Serializer

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_recaptcha.fields import ReCaptchaV2Field

# SQL model for auth
User = get_user_model()

# Signup ma k liney
class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    recaptcha = ReCaptchaV2Field(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name','phonenumber', 'college', 'confirm_password', 'recaptcha')
        extra_kwargs = { 'password': {'write_only': True} }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        validated_data.pop('recaptcha', None)
        user = User.objects.create_user(**validated_data)
        return user

# Response ma k send garne
class SignupResponseSerializer(serializers.ModelSerializer):
    detail = serializers.CharField(default="Verification Email sent.")
    class Meta:
        model = User
        fields = ('detail','user_guid','email','username','phonenumber','first_name','last_name','college')
        read_only_fields = fields

class EmailVerifySerializer(serializers.Serializer):
    token = serializers.CharField()

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    recaptcha = ReCaptchaV2Field(write_only=True)
    
    def validate(self, data):
        if User.objects.filter(email=data['email']).first() is None:
            raise serializers.ValidationError("User not found.")
        return data

class ForgotPasswordVerifySerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("New passwords do not match.")
        return data

class PhoneNumberChangeSerializer(serializers.Serializer):
    new_phonenumber = serializers.CharField(required=True)

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("New passwords do not match.")
        return data

class EmailVerifyRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user:
            raise serializers.ValidationError("User not found.")
        self.context["user"] = user
        return value

class VerifiedTokenObtainPairSerializer(TokenObtainPairSerializer):
    recaptcha = ReCaptchaV2Field()

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_email_verified:
            raise AuthenticationFailed("Please verify your email address before signing in.")

        if self.user.has_role("ADMIN"):
            data["ADMIN"] = [
                "dashboard",
                "add-question",
                "manage-categories",
                "manage-subcategories",
                "manage-users",
                "manage-users/:id",
                "manage-clients",
                "add-role",
                "add-college",
                "question-bank",
                "manage-question-sets",
                "manage-constraints",
                "manage-subscriptions",
                "application-feedback",
                "analytics",
                "manage-testimonials",
            ]

        return data



class GoogleLoginSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)


class GoogleExistingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_guid', 'email', 'username', 'phonenumber', 'first_name', 'last_name', 'college')
        read_only_fields = fields


class GoogleSignupSerializer(serializers.Serializer):
    signup_token = serializers.CharField(required=True)
    username = serializers.CharField(max_length=30, required=True)
    phonenumber = serializers.CharField(max_length=10, required=True)
    college = serializers.CharField(max_length=100, required=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_phonenumber(self, value):
        if User.objects.filter(phonenumber=value).exists():
            raise serializers.ValidationError(
                "A user with that phonenumber already exists."
            )
        return value

    def validate_signup_token(self, value):
        from core.token.google_signup.verify import verify_google_signup_token

        return verify_google_signup_token(value)

    def validate(self, attrs):
        token_payload = attrs["signup_token"]
        email = token_payload["email"]
        google_sub = token_payload["google_sub"]

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": ["A user with that email already exists."]}
            )

        if User.objects.filter(google_sub=google_sub).exists():
            raise serializers.ValidationError(
                {"google_sub": ["A user with that Google account already exists."]}
            )

        attrs["token_payload"] = token_payload
        return attrs

    def create(self, validated_data):
        token_payload = validated_data.pop("token_payload")
        validated_data.pop("signup_token", None)
        first_name = (token_payload.get("first_name") or "")[:20]
        last_name = (token_payload.get("last_name") or "")[:20]

        user = User(
            email=token_payload["email"],
            username=validated_data["username"],
            phonenumber=validated_data["phonenumber"],
            first_name=first_name,
            last_name=last_name,
            college=validated_data["college"],
            google_sub=token_payload["google_sub"],
            is_email_verified=True,
        )
        user.set_unusable_password()
        user.save()
        return user
