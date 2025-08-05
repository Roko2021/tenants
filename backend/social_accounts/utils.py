# backend/social_accounts/utils.py
from google.auth.transport import requests
from google.oauth2 import id_token
from accounts.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import make_password # لاستخدام hashing آمن لكلمات المرور

class Google:
    @staticmethod
    def validate(access_token):
        try:
            idinfo = id_token.verify_oauth2_token(access_token, requests.Request(), settings.GOOGLE_CLIENT_ID)

            if not idinfo['iss'] in ['accounts.google.com', 'https://accounts.google.com']:
                raise AuthenticationFailed('Wrong issuer.')

            user_id = idinfo['sub']
            email = idinfo.get('email')
            first_name = idinfo.get('given_name')
            last_name = idinfo.get('family_name')
            return {
                'user_id': user_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }
        except ValueError:
            raise AuthenticationFailed('Invalid Google token.')
        except Exception as e:
            print(f"Error during Google token validation: {e}")
            raise AuthenticationFailed('Invalid Google token.')




import logging
from accounts.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
import secrets
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()
logger = logging.getLogger(__name__)

def login_social_user(email, password=None): # اجعل كلمة المرور اختيارية
    logger.info(f"Attempting to login social user with email: {email}")
    try:
        user = User.objects.get(email=email)
        logger.info(f"Social user found: {user.email}")
        user_tokens = user.tokens()
        return {
            'email': user.email,
            'full_name': user.get_full_name(),
            'access_token': str(user_tokens.get('access')),
            'refresh_token': str(user_tokens.get('refresh')),
        }
    except User.DoesNotExist:
        logger.warning(f"Social user with email {email} not found during login attempt.")
        return None
    except Exception as e:
        logger.exception(f"Error during social login for user {email}: {e}")
        return None


def register_social_user(provider, email, google_first_name, google_last_name):
    logger.info(f"register_social_user called with: provider={provider}, email={email}, first_name={google_first_name}, last_name={google_last_name}")
    try:
        user = User.objects.filter(email=email).first()
        if user:
            logger.info(f"User found: {user.email}")
            if provider == user.auth_provider:
                return login_social_user(email) # استدعاء بدون كلمة مرور
            else:
                error_message = f"Please continue your login with {user.auth_provider}"
                logger.error(error_message)
                raise AuthenticationFailed(detail=error_message)
        else:
            logger.info("Creating new user")
            random_password = secrets.token_urlsafe(16)
            hashed_password = make_password(random_password)
            first_name = google_first_name if google_first_name else 'Social'
            last_name = google_last_name if google_last_name else 'User'
            new_user = User(email=email, first_name=first_name, last_name=last_name, password=hashed_password)
            new_user.auth_provider = provider
            new_user.is_verified = True
            new_user.username = email
            logger.info(f"Saving new user: {new_user.email}, first_name={new_user.first_name}, last_name={new_user.last_name}")
            new_user.save()
            return login_social_user(email) # استدعاء بدون كلمة مرور حتى عند الإنشاء
    except Exception as e:
        logger.exception(f"Error in register_social_user: {e}")
        raise

# def register_social_user(provider, email, google_first_name, google_last_name):
#     logger.info(f"register_social_user called with: provider={provider}, email={email}, first_name={google_first_name}, last_name={google_last_name}")
#     try:
#         user = User.objects.filter(email=email).first()
#         if user:
#             logger.info(f"User found: {user.email}")
#             if provider == user.auth_provider:
#                 return login_social_user(email, user.password)
#             else:
#                 error_message = f"Please continue your login with {user.auth_provider}"
#                 logger.error(error_message)
#                 raise AuthenticationFailed(detail=error_message)
#         else:
#             logger.info("Creating new user")
#             random_password = secrets.token_urlsafe(16)
#             hashed_password = make_password(random_password)
#             # استخدم القيم من بيانات جوجل مباشرة أو قم بتوفير قيم افتراضية
#             first_name = google_first_name if google_first_name else 'Social'
#             last_name = google_last_name if google_last_name else 'User'
#             new_user = User(email=email, first_name=first_name, last_name=last_name, password=hashed_password)
#             new_user.auth_provider = provider
#             new_user.is_verified = True
#             new_user.username = email
#             logger.info(f"Saving new user: {new_user.email}, first_name={new_user.first_name}, last_name={new_user.last_name}")
#             new_user.save()
#             return login_social_user(email, random_password)
#     except Exception as e:
#         logger.exception(f"Error in register_social_user: {e}")
#         raise