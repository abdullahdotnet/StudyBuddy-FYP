from django.urls import path, include
from account.views import UserRegistrationView
from account.views import UserLoginView,UserProfileView,UserChangePasswordView


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register_user'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword')
]
