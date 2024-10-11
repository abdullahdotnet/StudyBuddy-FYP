from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject
from .serializers import SubjectSerializer


class SubjectListView(APIView):
    def get(self, request):
        grade = request.query_params.get('grade', None)

        if grade:
            subjects = Subject.objects.filter(status=True, grade=grade)
        else:
            subjects = Subject.objects.filter(status=True)

        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
