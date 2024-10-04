from django.urls import path, include
from .views import ask_query
# from .views import ChatbotAPIView


urlpatterns = [
    # path('chatbot/', ChatbotAPIView.as_view(), name='chatbot-api'),
    path('chatbot/', ask_query, name='ask_query'),
]
