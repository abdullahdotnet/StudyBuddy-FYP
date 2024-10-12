from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject
from .serializers import SubjectSerializer
from .utils import generate_question_paper, split_questions, evaluate_mcq_chain


class SubjectListView(APIView):
    def get(self, request):
        grade = request.query_params.get('grade', None)

        if grade:
            subjects = Subject.objects.filter(status=True, grade=grade)
        else:
            subjects = Subject.objects.filter(status=True)

        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)


class ObjectivePaperView(APIView):
    def post(self, request):
        papers = request.data.get('papers', 1)
        try:
            paper_text = generate_question_paper(papers)
            questions = split_questions(paper_text[0])
            return Response(
                {
                    "message": "Questions generated successfully.",
                    "questions": questions
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ObjectiveEvaluationView(APIView):
    def post(self, request):
        try:
            questions = request.data.get("questions", None)

            if not questions:
                return Response(
                    {"error": "No question data provided."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            evaluation_result = evaluate_mcq_chain(questions)

            return Response(
                {
                    "message": "Evaluation completed.",
                    "result": evaluation_result
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
