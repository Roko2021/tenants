from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import UserRegisterSerializer, LoginSerialiazer, SetNewPasswordSerializer, PasswordResetRequestSerializer, LogoutUserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .utils import send_code_to_user
from .models import OneTimePassword,User
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
# Create your views here.

from .serializers import UserSerializer  # هنحتاج نكتبه حالًا


class RegisterUserView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    # def get(self, request, *args, **kwargs):
        # return Response({"message": "Send POST request with username, email, and password."}, status=status.HTTP_200_OK)


    def post(self, request):
        user_data=request.data
        serializer = self.serializer_class(data=user_data)
        # print(user['first_name'])
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user=serializer.data
            send_code_to_user(user['email'])
            return Response({
                'data': user,
                'message': f'Hi thanks for singing up a passcode ',
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class VerifyUserCodeView(GenericAPIView):
    def post(self, request):
        otpcode = request.data.get('otp')
        if not otpcode:
            return Response({
                'message': 'OTP code is required',
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_code_obj = OneTimePassword.objects.get(code=otpcode)
            user = user_code_obj.user
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({
                    'message': 'Account email verified successfully',
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'Code is invalid, user already verified',
            }, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist:
            return Response({
                'message': 'Invalid OTP code or expired',
            }, status=status.HTTP_400_BAD_REQUEST)


class LoginUserVeiw(GenericAPIView):
    serializer_class = LoginSerialiazer
    def post(self, request):
        serializer=self.serializer_class(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class TestAuthentiactionView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
        # data={
        #     'msg':'its works'
        # }
        # return Response(data, status=status.HTTP_200_OK)

class PasswordResetRequestView(GenericAPIView):
    serializer_class=PasswordResetRequestSerializer
    def post(self, request):
        serializer=self.serializer_class(data=request.data,context={'request':request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message':'password reset request sent to your email',
        },status=status.HTTP_200_OK)
        serializer.save()
        return Response({
            'message':'password reset request sent to your email',
        },status=status.HTTP_200_OK)

class PasswordResetConfirm(GenericAPIView):
    def get(self,request,uidb64,token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({
                   'message': 'token is invalid or has expired',
                },status=status.HTTP_401_UNAUTHORIZED)
            return Response({
                'success':True,
                'message': 'token is valid',
                'uidb64': uidb64,
                'token': token
            },status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError:
            return Response({
                   'message': 'token is invalid or has expired',
                },status=status.HTTP_401_UNAUTHORIZED)



class SetNewPassword(GenericAPIView):
    serializer_class=SetNewPasswordSerializer
    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message':'password reset successful'},status=status.HTTP_200_OK)



from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import logging
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
import logging


logger = logging.getLogger(__name__)

class LogoutUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # استلام الـ Refresh Token من البيانات
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            # التحقق من صلاحية التوكن
            token = RefreshToken(refresh_token)
            token.blacklist()  # وضع التوكن في القائمة السوداء

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            logger.exception(f"An error occurred during logout: {e}")
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)


