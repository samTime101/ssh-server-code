import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from core.permissions.permissions import IsAuthenticated, IsAdminUser
from core.constants.status import APPROVED_STATUS
from mongo.models import Question, Submissions
from sql.models import User, SubscriptionOrder
from .serializers import QuestionBankStatsSerializer, AdminDashboardStatsSerializer

logger = logging.getLogger(__name__)


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


class AdminDashboardStatsAPIView(APIView):
    permission_classes = [IsAdminUser]

    @extend_schema(responses=AdminDashboardStatsSerializer)
    def get(self, request, *args, **kwargs):
        print(f"[DEBUG AdminDashboardStatsAPIView] Incoming GET request from user: {request.user} (is_authenticated={request.user.is_authenticated}, is_staff={getattr(request.user, 'is_staff', None)})")
        logger.info(f"[DEBUG AdminDashboardStatsAPIView] Incoming GET request from user: {request.user}")

        # 1. Total Questions from Mongo DB
        try:
            total_questions = Question.objects(status=APPROVED_STATUS).count()
            print(f"[DEBUG AdminDashboardStatsAPIView] Mongo DB Question count (status={APPROVED_STATUS}): {total_questions}")
            logger.info(f"[DEBUG AdminDashboardStatsAPIView] Mongo DB Question count: {total_questions}")
        except Exception as e:
            print(f"[ERROR AdminDashboardStatsAPIView] Exception while fetching Mongo Question count: {e}")
            logger.error(f"[ERROR AdminDashboardStatsAPIView] Exception while fetching Mongo Question count: {e}", exc_info=True)
            total_questions = 0

        # 2. Active Users from SQL DB
        try:
            active_users = User.objects.filter(is_active=True).count()
            print(f"[DEBUG AdminDashboardStatsAPIView] SQL DB Active Users count: {active_users}")
            logger.info(f"[DEBUG AdminDashboardStatsAPIView] SQL DB Active Users count: {active_users}")
        except Exception as e:
            print(f"[ERROR AdminDashboardStatsAPIView] Exception while fetching active users: {e}")
            logger.error(f"[ERROR AdminDashboardStatsAPIView] Exception while fetching active users: {e}", exc_info=True)
            active_users = 0

        # 3. Approved Subscription Order from SQL DB
        try:
            approved_order = (
                SubscriptionOrder.objects.filter(
                    user=request.user,
                    status=SubscriptionOrder.Status.APPROVED,
                )
                .select_related("subscription")
                .order_by("-updated_at")
                .first()
            )
            print(f"[DEBUG AdminDashboardStatsAPIView] Approved order record: {approved_order}")
            logger.info(f"[DEBUG AdminDashboardStatsAPIView] Approved order record: {approved_order}")
            if approved_order:
                print(f"[DEBUG AdminDashboardStatsAPIView] Approved order plan name: {getattr(approved_order.subscription, 'plan_name', None)}")
        except Exception as e:
            print(f"[ERROR AdminDashboardStatsAPIView] Exception while fetching SubscriptionOrder: {e}")
            logger.error(f"[ERROR AdminDashboardStatsAPIView] Exception while fetching SubscriptionOrder: {e}", exc_info=True)
            approved_order = None

        current_subscription = (
            approved_order.subscription.plan_name if (approved_order and hasattr(approved_order, 'subscription') and approved_order.subscription) else "Free"
        )

        response_data = {
            "total_questions": total_questions,
            "active_users": active_users,
            "current_subscription": current_subscription,
        }
        print(f"[DEBUG AdminDashboardStatsAPIView] Prepared response_data: {response_data}")
        logger.info(f"[DEBUG AdminDashboardStatsAPIView] Prepared response_data: {response_data}")

        serializer = AdminDashboardStatsSerializer(response_data)
        print(f"[DEBUG AdminDashboardStatsAPIView] Serialized data: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)

