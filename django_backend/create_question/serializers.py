from rest_framework import serializers
from sqldb_app.models import Category, SubCategory, SubSubCategory
from mongodb_app.mongo import Question
from utils.helper.fetch_names import fetch_names

class QuestionSerializer(serializers.Serializer):
    questionText = serializers.CharField()
    description = serializers.CharField()
    questionType = serializers.ChoiceField(choices=['multiple', 'single'])
    options = serializers.ListField()
    correctAnswers = serializers.ListField()
    difficulty = serializers.ChoiceField(choices=['easy', 'medium', 'hard'])
    categoryId = serializers.IntegerField()
    subCategoryIds = serializers.ListField(child=serializers.IntegerField(), required=True)
    subSubCategoryIds = serializers.ListField(child=serializers.IntegerField(), required=True)

    def validate_categoryId(self, value):
        try:
            category = Category.objects.get(categoryId=value)
            self.categoryName = category.categoryName
        except Category.DoesNotExist:
            raise serializers.ValidationError(f"Category with id {value} does not exist.")
        return value

    def validate_subCategoryIds(self, value):
        try:
            self.subCategoryNames = fetch_names(SubCategory, value, 'subCategoryId', 'subCategoryName')
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_subSubCategoryIds(self, value):
        try:
            self.subSubCategoryNames = fetch_names(SubSubCategory, value, 'subSubCategoryId', 'subSubCategoryName')
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value


    def create(self, validated_data):
        data =  {
            "questionText": validated_data['questionText'],
            "description": validated_data['description'],
            "questionType": validated_data['questionType'],
            "options": validated_data['options'],
            "correctAnswers": validated_data['correctAnswers'],
            "difficulty": validated_data['difficulty'],
            "category": self.categoryName,
            "subCategory": self.subCategoryNames,
            "subSubCategory": self.subSubCategoryNames
        }
        question = Question(**data)
        question.save()
        return question
