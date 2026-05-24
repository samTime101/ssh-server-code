from core.constants.status import QUESTION_STATUSES
from mongo.models import Category

def filter_status_category(queryset, request):
    category_status = request.query_params.get("category_status", None)
    if category_status is not None:
        category_status = category_status.lower()
    if category_status in QUESTION_STATUSES:
        allowed_categories = Category.objects(status=category_status).scalar("id")
        return queryset.filter(category__in=list(allowed_categories))
    else:
        return queryset