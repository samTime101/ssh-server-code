from sql.models import User, Role, UserRole
from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Question, Submissions, Attempt
from core.validators.answer_validator import validate_attempt_answers
from core.validators.obj_id_validator import validate_object_id

class UserSerializer(serializers.ModelSerializer):
    total_right_attempts = serializers.SerializerMethodField()
    total_attempts = serializers.SerializerMethodField()
    accuracy_percent = serializers.SerializerMethodField()
    completion_percent = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id','user_guid','username', 'email', 'first_name', 'last_name', 'is_active','total_right_attempts','total_attempts', 'accuracy_percent', 'completion_percent', 'roles','is_email_verified','phonenumber', 'college')
    def get_total_right_attempts(self, obj):
        submission = Submissions.objects(user_guid=obj.user_guid).first()
        if not submission:
            return 0
        return sum(1 for attempt in submission.attempts if attempt.is_correct)

    def get_total_attempts(self, obj):
        submission = Submissions.objects(user_guid=obj.user_guid).first()
        if not submission:
            return 0
        return len(submission.attempts)

    def get_accuracy_percent(self, obj):
        total_attempts = self.get_total_attempts(obj)
        if total_attempts == 0:
            return 0.0
        total_right_attempts = self.get_total_right_attempts(obj)
        return (total_right_attempts / total_attempts) * 100
    
    def get_completion_percent(self, obj):
        total_questions = Question.objects.count()
        if total_questions == 0:
            return 0.0
        total_attempts = self.get_total_attempts(obj)
        return (total_attempts / total_questions) * 100
    
    def get_roles(self, obj):
        return obj.get_roles()
    
class AttemptSerializer(me_serializers.EmbeddedDocumentSerializer):
    question = serializers.CharField(write_only=True)
    question_text = serializers.SerializerMethodField(read_only=True)
    # SHOW SELECTED OPTION LABELS IN LIST
    selected_options_labels = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Attempt
        fields = ('question', 'selected_answers','is_correct', 'question_text', 'selected_options_labels')
        extra_kwargs = {'is_correct':{'read_only':True}}
    
    def get_question_text(self, obj):
        return str(obj.question.question_text)
    
    def get_selected_options_labels(self, obj):
        option_labels = []
        question = obj.question
        for label in obj.selected_answers:
            for option in question.options:
                if option.label == label:
                    option_labels.append(option.text)
        return option_labels

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
    categories = serializers.SerializerMethodField(read_only=True)
    subcategories = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Submissions
        fields = ('user_guid', 'attempts', 'started_at','categories','subcategories')

    def get_categories(self, obj):
        categories = set()
        for attempt in obj.attempts:
            question = attempt.question
            categories.update(question.get_category_names())
        return list(categories)
    def get_subcategories(self, obj):
        subcategories = set()
        for attempt in obj.attempts:
            question = attempt.question
            subcategories.update(question.get_subcategory_names())
        return list(subcategories)

class SubmissionResponseSerializer(me_serializers.EmbeddedDocumentSerializer):
    detail = serializers.CharField(default="Submission recorded successfully")
    incorrect_answers = serializers.SerializerMethodField()
    correct_answers = serializers.SerializerMethodField()
    class Meta:
        model = Attempt
        fields = ('is_correct', 'detail', 'incorrect_answers', 'correct_answers', 'selected_answers')
        read_only_fields = fields

    def get_incorrect_answers(self, obj):
        question = obj.question
        correct_answers = question.correct_answers()
        selected_answers = set(obj.selected_answers)
        return list(selected_answers - correct_answers)

    def get_correct_answers(self, obj):
        question = obj.question
        correct_answers = question.correct_answers()
        selected_answers = set(obj.selected_answers)
        return list(selected_answers & correct_answers)
    
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('user', 'role', 'assigned_at')
        read_only_fields = ('id', 'assigned_at')

class AssignRoleSerializer(serializers.Serializer):
    role_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_role_ids(self, value):
        for role_id in value:
            if not Role.objects.filter(id=role_id).exists():
                raise serializers.ValidationError(f"Role with id {role_id} does not exist.")
        return value