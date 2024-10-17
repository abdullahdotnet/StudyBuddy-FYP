from django.urls import path
from .views import GenerateQuestionPaperAPIView

urlpatterns = [
    path('generate-entry-test/', GenerateQuestionPaperAPIView.as_view(), name='generate-entry-test')
]
