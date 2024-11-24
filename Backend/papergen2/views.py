from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject
from .serializers import SubjectSerializer
from .utils import generate_question_paper, split_questions, evaluate_mcq_chain
from .full_paper import get_objective_questions, get_subjective_questions, evaluate_objective_chain


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
    def post(self, request, grade, subject):
        if not grade or not subject:
            return Response(
                {"error": "Grade and subject are required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            questions = get_objective_questions(grade, subject)
            return Response(
                {
                    "message": "Objective questions generated successfully.",
                    "questions": questions
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubjectivePaperView(APIView):
    def post(self, request, grade, subject):
        if not grade or not subject:
            return Response(
                {"error": "Grade and subject are required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            questions = get_subjective_questions(grade, subject)
            return Response(
                {
                    "message": "Subjective questions generated successfully.",
                    "questions": questions
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FullBookPaperView(APIView):
    def post(self, request, grade, subject):
        if not grade or not subject:
            return Response(
                {"error": "Grade and subject are required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            objective = get_objective_questions(grade, subject)
            subjective = get_subjective_questions(grade, subject)

            response = {
                "objective": objective,
                "subjective": subjective
            }

            if not objective or not subjective:
                return Response(
                    {"error": "No paper generated, please check the grade or subject."},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ObjectiveEvaluationView(APIView):
    def post(self, request, grade, subject):
        try:
            questions = request.data.get("questions", None)

            if not questions:
                return Response(
                    {"error": "No question data provided."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            evaluation_result = evaluate_objective_chain(
                questions, grade, subject
            )

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
