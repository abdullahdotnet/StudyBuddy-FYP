from django.urls import path
from .views import BoardPaperGenerationView

urlpatterns = [
    # path('/generate', TestSessionView.as_view(), name='generate'),
    path('board-paper-generate/', BoardPaperGenerationView.as_view(), name='simple-api-view')
]