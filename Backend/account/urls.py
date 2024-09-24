from django.urls import path, include
from account.views import UserRegistrationView
from account.views import UserLoginView


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register_user'),
    path('login/', UserLoginView.as_view(), name='login')
]
