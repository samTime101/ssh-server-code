# SAMIP REGMI
# AUGUST 23

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateQuestionSerializer

# FOR TESTING
from mongodb_app.mongo import Question

class CreateQuestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # ONLY SUPERUSER AND STAFF CAN CREATE QUESTIONS
        if not request.user.is_superuser and not request.user.is_staff:
            response_data = {
                "message": "You do not have permission to create a question",
            }
            return Response(response_data, status=status.HTTP_403_FORBIDDEN)
        print(request.data)
        serializer = CreateQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        

        # RETURNING CUSTOM RESPONSE
        response_data = {
            "message": "Question created successfully",
            "question": {
                "id": str(question.id),  
                "questionText": question.questionText,
                "questionType": question.questionType,
                "options": [{"optionId": option.optionId, "text": option.text} for option in question.options],
                "correctAnswers": question.correctAnswers,
                "difficulty": question.difficulty,
                "category": question.category,
                "subCategory": question.subCategory,
                "subSubCategory": question.subSubCategory,
                "createdAt": question.createdAt,
                "updatedAt": question.updatedAt,
            }
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def get(self,request):
        # FOR TESTING
        # RETURN ALL QUESTIONS
        questions = Question.objects.all()
        question_list = []
        for question in questions:
            question_list.append({
                "id": str(question.id),  
                "questionText": question.questionText,
                "questionType": question.questionType,
                "options": [{"optionId": option.optionId, "text": option.text} for option in question.options],
                "correctAnswers": question.correctAnswers,
                "difficulty": question.difficulty,
                "category": question.category,
                "subCategory": question.subCategory,
                "subSubCategory": question.subSubCategory,
                "createdAt": question.createdAt,
                "updatedAt": question.updatedAt,
            })
            response_data = {
                # "message": "Questions retrieved successfully",
                "questions": question_list
            }
        return Response(response_data, status=status.HTTP_200_OK)

