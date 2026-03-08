from bson import ObjectId
from rest_framework.exceptions import ValidationError
from mongoengine.queryset.visitor import Q
from mongo.models import SubCategory


def filter_questions_queryset(queryset, query_params):
    search = query_params.get("search")
    category_id = query_params.get("category_id")
    sub_category_id = query_params.get("sub_category_id")
    if search:
        queryset = queryset.filter(Q(question_text__icontains=search) |Q(description__icontains=search))
    if sub_category_id:
        if not ObjectId.is_valid(sub_category_id):
            raise ValidationError({"sub_category_id": "Invalid ObjectId format."})
        queryset = queryset.filter(sub_categories=sub_category_id)

    if category_id:
        if not ObjectId.is_valid(category_id):
            raise ValidationError({"category_id": "Invalid ObjectId format."})
        valid_subcats = SubCategory.objects(category=category_id).scalar("id")
        queryset = queryset.filter(sub_categories__in=list(valid_subcats))

    return queryset