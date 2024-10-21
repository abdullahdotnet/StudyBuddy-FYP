from django.urls import path
from .views import (
    SubjectListView,
    ObjectivePaperView,
    SubjectivePaperView,
    FullBookPaperView,
    ObjectiveEvaluationView,
)

urlpatterns = [
    path('subjects/', SubjectListView.as_view()),
    path('generate-objective/<str:grade>/<str:subject>/', ObjectivePaperView.as_view()),
    path('generate-subjective/<str:grade>/<str:subject>/', SubjectivePaperView.as_view()),
    path('generate-full-paper/<str:grade>/<str:subject>/', FullBookPaperView.as_view()),
    path('evaluate-objective/<str:grade>/<str:subject>/', ObjectiveEvaluationView.as_view()),
]
