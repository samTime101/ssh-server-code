

from mongoengine.errors import NotUniqueError
from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from rest_framework_mongoengine.validators import UniqueValidator
from mongo.models import QuestionSet, Question
from core.validators.obj_ids_validator import validate_object_ids

class QuestionSetSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=QuestionSet.objects.all())])    
    question_ids = serializers.ListField(child=serializers.CharField(), write_only=True, required=True)
    question_count = serializers.SerializerMethodField(read_only=True)
    questions = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = QuestionSet
        fields = ['id', 'name', 'description', 'question_ids', 'question_count', 'questions', 'created_at', 'updated_at']
        extra_kwargs = {'created_at': {'read_only': True}, 'updated_at': {'read_only': True}}

    def get_question_count(self, obj):
        return len(obj.questions) if obj.questions else 0
    
    def get_questions(self, obj):
        if obj.questions:
            return [(str(q.id)) for q in obj.questions]
        return []

    def validate_question_ids(self, value):
        if not value:
            raise serializers.ValidationError("At least one question ID is required.")
        return validate_object_ids(value, Question, "question_ids", allow_empty=False)

    def create(self, validated_data):
        question_ids = validated_data.pop("question_ids")
        questions = Question.objects(id__in=question_ids, status="approved")       
        if len(questions) != len(set(question_ids)):
            raise serializers.ValidationError({"question_ids": "Some questions are invalid or not approved."})
        # try:
        qs = QuestionSet(**validated_data)
        qs.questions = list(questions)
        qs.save()
        return qs
    
    def update(self, instance, validated_data):
        question_ids = validated_data.pop("question_ids", None)
        if question_ids is not None:
            questions = Question.objects(id__in=question_ids, status="approved")
            if len(questions) != len(set(question_ids)):
                raise serializers.ValidationError({"question_ids": "Some questions are invalid or not approved."})
            instance.questions = list(questions)
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)        
        instance.save()
        return instance