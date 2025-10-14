# REFACTORED ON SEP 20 2025
# SAMIP REGMI


from rest_framework import serializers
from mongodb_app.mongo import  Question
from sqldb_app.models import Category, SubCategory, SubSubCategory  
from utils.helper.fetch_names import fetch_names
from django.core.exceptions import ObjectDoesNotExist

class OptionSerializer(serializers.Serializer):
    optionId = serializers.CharField()
    text = serializers.CharField()

class QuestionDataSerializer(serializers.Serializer):
    id = serializers.CharField()
    questionText = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    questionType = serializers.CharField()
    options = OptionSerializer(many=True)
    difficulty = serializers.CharField()
    category = serializers.CharField()
    subCategory = serializers.ListField(child=serializers.CharField())
    subSubCategory = serializers.ListField(child=serializers.CharField())
    createdAt = serializers.DateTimeField()
    updatedAt = serializers.DateTimeField()

class QuestionResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    questions = QuestionDataSerializer(many=True)

class SelectQuestionSerializer(serializers.Serializer):

    categoryId = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)
    subCategoryId = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)
    subSubCategoryId = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)

    def validate_categoryId(self, value):
        try:
            self.categoryNames = fetch_names(Category, value, 'categoryId', 'categoryName')
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_subCategoryId(self, value):
        try:
            self.subCategoryNames = fetch_names(SubCategory, value, 'subCategoryId', 'subCategoryName')
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_subSubCategoryId(self, value):
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
        self.questions = result if result else Question.objects().all()
        return self.questions

