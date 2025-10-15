from rest_framework import serializers
from sqldb_app.models import Category, SubCategory, SubSubCategory
from mongodb_app.mongo import Question
from utils.helper.fetch_names import fetch_names
from utils.helper.QuestionCategoryManager import QuestionCategoryManager

class OptionSerializer(serializers.Serializer):
    optionId = serializers.CharField()
    text = serializers.CharField()

    
class QuestionSerializer(serializers.Serializer):
    questionText = serializers.CharField()
    description = serializers.CharField()
    questionType = serializers.ChoiceField(choices=['multiple', 'single'])
    options = OptionSerializer(many=True)
    correctAnswers = serializers.ListField(child=serializers.CharField())
    difficulty = serializers.ChoiceField(choices=['easy', 'medium', 'hard'])
    categoryIds = serializers.ListField(child=serializers.IntegerField(), required=True)
    subCategoryIds = serializers.ListField(child=serializers.IntegerField(), required=True)
    subSubCategoryIds = serializers.ListField(child=serializers.IntegerField(), required=True)

    def validate_categoryIds(self, value):
        try:
            self.categoryNames = fetch_names(Category, value, 'categoryId', 'categoryName')
        except Exception as e:
            raise serializers.ValidationError(str(e))
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
        try:
            question = Question(
            questionText=validated_data['questionText'],
            description=validated_data['description'],
            questionType=validated_data['questionType'],
            options=validated_data['options'],
            correctAnswers=validated_data['correctAnswers'],
            difficulty=validated_data['difficulty'],
        )
            question.save()
            manager = QuestionCategoryManager(question, self.categoryNames, self.subCategoryNames, self.subSubCategoryNames)
            manager.update()
            return question        
        except Exception as e:
            raise serializers.ValidationError(str(e))


class CreateQuestionResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    questionId = serializers.CharField()