from django.contrib import admin
from django.urls import path
from .views import RegisterUserView,VerifyUserCodeView,LoginUserVeiw,TestAuthentiactionView, PasswordResetConfirm,PasswordResetRequestView,SetNewPassword,LogoutUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name='register'),
    path("verify-email/", VerifyUserCodeView.as_view(), name='verify'),
    path("login/", LoginUserVeiw.as_view(), name='login'),
    path("profile/", TestAuthentiactionView.as_view(), name='granted'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token/refresh/'),
    path("password-reset/", PasswordResetRequestView.as_view(), name='password-reset'),
    path("password-reset/confirm/<uidb64>/<token>/", PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path("set-new-password/", SetNewPassword.as_view(), name='set-new-password'),
    path("logout/", LogoutUserView.as_view(), name='logout'),
]