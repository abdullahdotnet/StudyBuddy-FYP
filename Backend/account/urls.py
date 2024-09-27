from django.urls import path
from account.views import UserRegistrationView
from account.views import (
    UserLoginView,
    UserProfileView,
    UserChangePasswordView,
    SendPasswordResetEmailView,
    UserPasswordResetView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register_user'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', UserChangePasswordView.as_view(), name='change-password'),
    path('reset-password/', SendPasswordResetEmailView.as_view(), name='reset-password'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password-mail'),
]
