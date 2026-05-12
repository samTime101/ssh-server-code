

from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from rest_framework_mongoengine.validators import UniqueValidator
from drf_spectacular.utils import extend_schema_field
from core.constants.status import APPROVED_STATUS
from mongo.models import Constraint, QuestionSet, Question
from core.validators.obj_id_validator import validate_object_id
from core.validators.obj_ids_validator import validate_object_ids
from core.mixins.constraint_mixin import ConstraintValidatorMixin

class QuestionSetSerializer(me_serializers.DocumentSerializer, ConstraintValidatorMixin):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=QuestionSet.objects.all())])    
    question_ids = serializers.ListField(child=serializers.CharField(), write_only=True, required=True)
    question_count = serializers.SerializerMethodField(read_only=True)
    questions = serializers.SerializerMethodField(read_only=True)
    constraint = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = QuestionSet
        fields = ['id', 'name', 'description', 'question_ids', 'question_count', 'questions', 'constraint', 'created_at', 'updated_at']
        extra_kwargs = {'created_at': {'read_only': True},'updated_at': {'read_only': True},}

    @extend_schema_field(serializers.IntegerField())
    def get_question_count(self, obj):
        return len(obj.questions) if obj.questions else 0
    
    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_questions(self, obj):
        if obj.questions:
            return [(str(q.id)) for q in obj.questions]
        return []

    def validate_constraint(self, value):
        if value in (None, ""):
            return None
        return validate_object_id(value, Constraint, "constraint")

    def validate_question_ids(self, value):
        if not value:
            raise serializers.ValidationError("At least one question ID is required.")
        return validate_object_ids(value, Question, "question_ids", allow_empty=False)

    def validate(self, data):
        questions = data.get("question_ids")
        constraint = data.get("constraint")
        if constraint:
            question_objs = Question.objects(id__in=questions, status=APPROVED_STATUS)
            if len(question_objs) != len(set(questions)):
                raise serializers.ValidationError({"question_ids": "Some questions are invalid or not approved."})
            self.validate_questions_against_constraint(question_objs, constraint)
        return data
            

    def create(self, validated_data):
        question_ids = validated_data.pop("question_ids")
        validated_data.pop("constraint", None)
        questions = Question.objects(id__in=question_ids, status=APPROVED_STATUS)       
        if len(questions) != len(set(question_ids)):
            raise serializers.ValidationError({"question_ids": "Some questions are invalid or not approved."})
        qs = QuestionSet(**validated_data)
        qs.questions = list(questions)
        qs.save()
        return qs
    
    def update(self, instance, validated_data):
        question_ids = validated_data.pop("question_ids", None)
        validated_data.pop("constraint", None)
        if question_ids is not None:
            questions = Question.objects(id__in=question_ids, status=APPROVED_STATUS)
            if len(questions) != len(set(question_ids)):
                raise serializers.ValidationError({"question_ids": "Some questions are invalid or not approved."})
            instance.questions = list(questions)
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)        
        instance.save()
        return instance