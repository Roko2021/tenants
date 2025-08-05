from django.urls import path
from .views import GoogleSignInView
# from .views import GoogleSignInView, GoogleAuthView, GithubSignInView

urlpatterns = [
    path('google/', GoogleSignInView.as_view(), name='google'),
    # path('github/', GithubSignInView.as_view(), name='github'),
]