from django.urls import path
from .views import ImageDataView


urlpatterns = [
    path('upload/', ImageDataView.as_view(), name='upload_image'),
]
