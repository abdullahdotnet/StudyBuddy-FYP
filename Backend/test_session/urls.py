from django.urls import path
from .views import BoardPaperGenerationView
from .views import BoardPaperEvaluation

urlpatterns = [
    # path('/generate', TestSessionView.as_view(), name='generate'),
    path('board-paper-generate/', BoardPaperGenerationView.as_view(), name='board-paper-generate'),
    path('extract-text/', BoardPaperEvaluation.as_view(), name='extract-text')
]