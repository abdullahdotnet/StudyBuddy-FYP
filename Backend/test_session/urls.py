from django.urls import path
from .views import BoardPaperGenerationView
# from .views import BoardPaperEvaluation

urlpatterns = [
    path('board-paper-generate/', BoardPaperGenerationView.as_view(), name='board-paper-generate'),
    # path('evaluate-paper/', BoardPaperEvaluation.as_view(), name='evaluate-paper')

]