# REFACTORED ON SEP 20 2025
# SAMIP REGMI


from rest_framework import serializers
from mongodb_app.mongo import  Question
from sqldb_app.models import Category, SubCategory, SubSubCategory  
from utils.helper.fetch_names import fetch_names
from django.core.exceptions import ObjectDoesNotExist

class SelectQuestionSerializer(serializers.Serializer):

    categoryIds = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)
    subCategoryIds = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)
    subSubCategoryIds = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)

    def validate_categoryIds(self, value):
        try:
            self.categoryNames = fetch_names(Category, value, 'categoryId', 'categoryName')
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_subCategoryIds(self, value):
        try:
            self.subCategoryNames = fetch_names(SubCategory, value, 'subCategoryId', 'subCategoryName')
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_subSubCategoryIds(self, value):
        try:
            self.subSubCategoryNames = fetch_names(SubSubCategory, value, 'subSubCategoryId', 'subSubCategoryName')
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(str(e))
        return value

    def get_questions(self):
        categories = getattr(self, 'categoryNames', [])
        subCategories = getattr(self, 'subCategoryNames', [])
        subSubCategories = getattr(self, 'subSubCategoryNames', [])

        result = Question.objects()
        if categories:
            result = result.filter(category__in=categories)
        if subCategories:
            result = result.filter(subCategory__in=subCategories)
        if subSubCategories:
            result = result.filter(subSubCategory__in=subSubCategories)
        if result:
            return result
        else:
            return Question.objects.all()
