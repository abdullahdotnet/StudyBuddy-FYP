# ocr_utility/urls.py
from django.urls import path
from .views import ocr_view

urlpatterns = [
    path('extract-text/', ocr_view, name='ocr_view'),
]
