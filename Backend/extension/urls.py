from django.urls import path, include
from .views import FileUploadAPIView
urlpatterns = [
    path('upload/', FileUploadAPIView.as_view(), name='upload'),
    # path('chatbot/', ask_query, name='ask_query'),
]
