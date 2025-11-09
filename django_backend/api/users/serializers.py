from sql.models import User
from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Question, Submissions, Attempt
from core.validators.answer_validator import validate_attempt_answers
from core.validators.obj_id_validator import validate_object_id

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','user_guid','username', 'email', 'first_name', 'last_name', 'is_active','is_staff','is_superuser')

class AttemptSerializer(me_serializers.EmbeddedDocumentSerializer):
    question = serializers.CharField()
    class Meta:
        model = Attempt
        fields = ('question', 'selected_answers','is_correct')
        extra_kwargs = {'is_correct':{'read_only':True}}

    def validate_question(self, value):
        print('value: ',value)
        return validate_object_id(value, model=Question, field_name="question")

    def validate(self, attrs):
        question = attrs['question']
        selected_answers = attrs['selected_answers']
        attrs['is_correct'] = validate_attempt_answers(question,selected_answers)
        return attrs

class SubmissionsSerializer(me_serializers.DocumentSerializer):
    attempts = AttemptSerializer(many=True)
    class Meta:
        model = Submissions
        fields = ('user_guid', 'attempts', 'started_at')

class SubmissionResponseSerializer(me_serializers.EmbeddedDocumentSerializer):
    detail = serializers.CharField(default="Submission recorded successfully")
    class Meta:
        model = Attempt
        fields = ('is_correct', 'detail')
        read_only_fields = fields
