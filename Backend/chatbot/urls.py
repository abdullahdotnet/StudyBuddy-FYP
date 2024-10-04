from django.urls import path, include
from .views import AskQuery
# from .views import ChatbotAPIView


urlpatterns = [
    # path('chatbot/', ChatbotAPIView.as_view(), name='chatbot-api'),
    path('chatbot/', AskQuery, name='ask_query'),
]
