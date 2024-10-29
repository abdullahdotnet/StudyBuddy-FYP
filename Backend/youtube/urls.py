from django.urls import path
from .views import ImageDataView, YoutubeSummaryView, YoutubeChatView


urlpatterns = [
    path('upload/', ImageDataView.as_view(), name='upload_image'),
    path('yt-summary/', YoutubeSummaryView.as_view(), name='yt_summary'),
    path('yt-chat/', YoutubeChatView.as_view(), name='yt_chat'),
]
