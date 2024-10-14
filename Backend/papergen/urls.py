from django.urls import path
from .views import SubjectListView, ObjectivePaperView, ObjectiveEvaluationView

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subjects'),
    path('generate-paper/', ObjectivePaperView.as_view(), name='objective_questions'),
    path('evaluate-paper/', ObjectiveEvaluationView.as_view(), name='evaluate_questions'),
]
