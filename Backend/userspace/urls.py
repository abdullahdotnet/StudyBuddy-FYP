from django.urls import path
from .views import FileUploadAPIView, UserFilesAPIView

urlpatterns = [
    path('upload/', FileUploadAPIView.as_view(), name='upload'),
    path('user_files/', UserFilesAPIView.as_view(), name='user_files'),
]