from rest_framework import serializers
from .utils import Google,register_social_user
# from .github import github
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed,ValidationError


class GoogleSignInSerializer(serializers.Serializer):
    access_token = serializers.CharField(min_length=6, write_only=True)

    def validate(self, data):
        access_token = data.get('access_token')
        try:
            google_user_data = Google.validate(access_token)
            return {
                'email': google_user_data.get('email'),
                'first_name': google_user_data.get('first_name'), # احصل على الاسم الأول
                'last_name': google_user_data.get('last_name')   # احصل على الاسم الأخير
            }
        except AuthenticationFailed as e:
            raise serializers.ValidationError(str(e))
        except Exception as e:
            raise serializers.ValidationError('Invalid Google token.')



# class GithubOuathSerializer(serializers.Serializer):
#     code=serializers.CharField(min_length=2)

#     def validate_code(self,code):
#         access_token=github.exchange_code_for_token(code)
#         if access_token:
#             user=github.retive_github_user(access_token)
#             full_name=user['name']
#             email=user['email']
#             names=full_name.split(" ")
#             first_name=names[1]
#             last_name=names[0]
#             provider="github"
#             return register_social_user(provider,email,first_name,last_name)

#         else:
#             raise ValidationError("token is invalied or expired")
