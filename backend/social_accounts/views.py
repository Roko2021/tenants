from django.shortcuts import render
from rest_framework.generics import GenericAPIView
# from .serializers import GoogleSignInSerializer, GithubOuathSerializer
from .serializers import GoogleSignInSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from google.auth.transport.requests import Request
from google.oauth2 import id_token
# from django.contrib.auth.models import User
from .utils import register_social_user  # تأكد من أن هذه الدالة موجودة في utils.py
from rest_framework.views import APIView
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from django.db import IntegrityError
from django.contrib.auth import get_user_model
User = get_user_model()


def verify_google_token(token):
    try:
        # فك التوكن والتحقق من صلاحية البيانات
        payload = jwt.decode(token, options={"verify_signature": False})  # استخدم التوقيع للتحقق إذا كنت بحاجة إليه
        return payload
    except ExpiredSignatureError:
        raise Exception("التوكن منتهي الصلاحية")
    except InvalidTokenError:
        raise Exception("التوكن غير صالح")


import logging

logger = logging.getLogger(__name__)
# دالة لإنشاء مستخدم جديد من Google
def create_user_from_google(id_info):
    try:
        logger.debug(f"Received user data: {id_info}")
        user, created = User.objects.get_or_create(
            email=id_info['email'],
            defaults={
                'first_name': id_info.get('given_name', ''),
                'last_name': id_info.get('family_name', ''),
                'auth_provider':"google",
                'email': id_info['email']
            }
        )
        if created:
            logger.debug(f"Created new user: {user.email}")
        else:
            logger.debug(f"User already exists: {user.email}")
        return user
    except IntegrityError as e:
        logger.error(f"IntegrityError: {str(e)}")
        raise

# عرض المصادقة عبر Google باستخدام APIView

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import GoogleSignInSerializer
from .utils import register_social_user
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
User = get_user_model()

logger = logging.getLogger(__name__)


class GoogleSignInView(APIView):
    serializer_class = GoogleSignInSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        logger.info("GoogleSignInView.post called")
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        logger.info(f"Validated data: {data}")
        try:
            user_data = register_social_user(
                provider='google',
                email=data.get('email'),
                google_first_name=data.get('first_name'), # استخدم الاسم الذي تم إرجاعه من المسلسل
                google_last_name=data.get('last_name')   # استخدم الاسم الذي تم إرجاعه من المسلسل
            )
            logger.info(f"register_social_user returned: {user_data}")
            if user_data:
                user = User.objects.get(email=user_data['email'])
                refresh = RefreshToken.for_user(user)
                response_data = {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'full_name': user.get_full_name(),
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                }
                logger.info(f"Returning response: {response_data}")
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                logger.error("register_social_user failed")
                return Response({'error': 'Failed to register or login user.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(f"Error in GoogleSignInView.post: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



# class GoogleAuthView(APIView): # تم التعليق عليه لتجنب التكرار
#     def post(self, request, *args, **kwargs):
#         token = request.data.get('access_token')
#         if not token:
#             return Response({"error": "Missing access token"}, status=400)
#
#         try:
#             user_data = verify_google_token(token)
#             return Response({"message": "تم تسجيل الدخول بنجاح!"})
#         except Exception as e:
#             return Response({"error": str(e)}, status=400)


# حذف الفئات الأخرى التي تتعامل مع تسجيل الدخول بجوجل لتجنب التكرار
# class GoogleAuthView(APIView):
#     pass

# عرض تسجيل الدخول عبر Google باستخدام GenericAPIView
class GoogleAuthView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.data.get('access_token')
        if not token:
            return Response({"error": "Missing access token"}, status=400)
        
        try:
            user_data = verify_google_token(token)
            return Response({"message": "تم تسجيل الدخول بنجاح!"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)




# from rest_framework import serializers, status
# from rest_framework.views import APIView, Response
# from rest_framework.generics import GenericAPIView
# from rest_framework.exceptions import ValidationError
# from django.contrib.auth import get_user_model
# from django.conf import settings
# import jwt
# import requests
# import datetime

# User = get_user_model()


# class GithubAPI:
#     def exchange_code_for_token(self, code):
#         """
#         Exchange the authorization code for an access token from GitHub.
#         """
#         payload = {
#             'client_id': settings.GITHUB_CLIENT_ID,
#             'client_secret': settings.GITHUB_CLIENT_SECRET,
#             'code': code,
#             'redirect_uri': settings.GITHUB_REDIRECT_URI,
#         }
#         headers = {'Accept': 'application/json'}
#         try:
#             response = requests.post('https://github.com/login/oauth/access_token', data=payload, headers=headers)
#             response.raise_for_status()
#             data = response.json()
#             return data.get('access_token')
#         except requests.exceptions.RequestException as e:
#             print(f"Error exchanging code for token: {e}")
#             return None

#     def retive_github_user(self, access_token):
#         """
#         Retrieve user information from GitHub using the access token.
#         """
#         headers = {'Authorization': f'token {access_token}', 'Accept': 'application/json'}
#         try:
#             user_response = requests.get('https://api.github.com/user', headers=headers)
#             user_response.raise_for_status()
#             user_data = user_response.json()

#             # Retrieve email
#             email_response = requests.get('https://api.github.com/user/emails', headers=headers)
#             email_response.raise_for_status()
#             emails = email_response.json()
#             primary_email = next((email['email'] for email in emails if email.get('primary')), None)

#             user_data['email'] = primary_email
#             return user_data
#         except requests.exceptions.RequestException as e:
#             print(f"Error retrieving user data: {e}")
#             return None


# github = GithubAPI()


# def register_social_user(provider, email, first_name="", last_name="", password=""):
#     """
#     Register a user with social authentication data.
#     """
#     if not email:
#         raise ValidationError("Email is required for social login.")

#     user, created = User.objects.get_or_create(email=email)
#     if created:
#         user.first_name = first_name
#         user.last_name = last_name
#         user.provider = provider
#         user.set_unusable_password(password)
#         user.is_active = True
#         user.save()
#     return user


# def generate_jwt_tokens(user):
#     payload = {
#         'user_id': user.id,
#         'email': user.email,
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
#         'iat': datetime.datetime.utcnow()
#     }
#     access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
#     if isinstance(access_token, bytes):
#         access_token = access_token.decode("utf-8")

#     refresh_payload = {
#         'user_id': user.id,
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
#         'iat': datetime.datetime.utcnow()
#     }
#     refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm='HS256')
#     if isinstance(refresh_token, bytes):
#         refresh_token = refresh_token.decode("utf-8")

#     return access_token, refresh_token



# class GithubOuathSerializer(serializers.Serializer):
#     code = serializers.CharField(min_length=2)

#     def validate_code(self, code):
#         access_token = github.exchange_code_for_token(code)
#         if access_token:
#             user_data = github.retive_github_user(access_token)
#             if user_data:
#                 email = user_data.get('email')
#                 if not email:
#                     raise ValidationError("Email is not provided by GitHub.")
#                 full_name = user_data.get('name', '')
#                 names = full_name.split(" ")
#                 first_name = names[0] if names else ""
#                 last_name = names[-1] if len(names) > 1 else ""
#                 provider = "github"
#                 user = register_social_user(provider, email, first_name, last_name)

#                 access_token, refresh_token = generate_jwt_tokens(user)

#                 return {
#                     'access_token': access_token,
#                     'refresh_token': refresh_token,
#                     'user': {
#                         'id': user.id,
#                         'email': user.email,
#                         'first_name': user.first_name,
#                         'last_name': user.last_name,
#                     }
#                 }
#             else:
#                 raise ValidationError("Failed to retrieve user data from GitHub")
#         else:
#             raise ValidationError("Invalid or expired authorization code")


# class GithubSignInView(GenericAPIView):
#     serializer_class = GithubOuathSerializer

#     def post(self, request):
#         try:
#             serializer = self.serializer_class(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             validated_data = serializer.validated_data
#             return Response(validated_data, status=status.HTTP_200_OK)
#         except ValidationError as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(f"Unexpected error: {e}")
#             return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
