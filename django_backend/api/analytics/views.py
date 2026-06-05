from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from core.permissions.permissions import IsAuthenticated
from core.constants.status import APPROVED_STATUS
from mongo.models import Question, Submissions
from .serializers import QuestionBankStatsSerializer


class QuestionBankStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=QuestionBankStatsSerializer)
    def get(self, request, *args, **kwargs):
        user_guid = getattr(request.user, "user_guid", None)
        submissions = Submissions.objects(type='question_bank', user_guid=user_guid)

        total_questions = Question.objects(status=APPROVED_STATUS).count()

        latest_attempts = {}
        unique_question_ids = set()
        for submission in submissions:
            for attempt in submission.attempts or []:
                question_id = str(attempt.question.id)
                unique_question_ids.add(question_id)
                key = question_id
                existing_attempt = latest_attempts.get(key)
                if existing_attempt is None or attempt.attempted_at > existing_attempt.attempted_at:
                    latest_attempts[key] = attempt

        total_latest_attempts = len(latest_attempts)
        total_correct_attempts = sum(1 for attempt in latest_attempts.values() if attempt.is_correct)
        total_incorrect_attempts = total_latest_attempts - total_correct_attempts
        accuracy_percent = round((total_correct_attempts / total_latest_attempts) * 100, 2) if total_latest_attempts else 0.0
        questions_coverage_percent = round((len(unique_question_ids) / total_questions) * 100, 2) if total_questions else 0.0

        response_data = {
            'total_questions': total_questions,
            'question_bank_submissions': submissions.count(),
            'latest_attempts_count': total_latest_attempts,
            'latest_correct_attempts': total_correct_attempts,
            'latest_incorrect_attempts': total_incorrect_attempts,
            'unique_questions_attempted': len(unique_question_ids),
            'questions_coverage_percent': questions_coverage_percent,
            'accuracy_percent': accuracy_percent,
        }

        serializer = QuestionBankStatsSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
