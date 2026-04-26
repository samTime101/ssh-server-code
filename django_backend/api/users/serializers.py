from core.constants.roles import ROLE_USER
from sql.models import User, Role, UserRole
from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Question, Submissions, Attempt, Bookmark
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

    # suruama sabai submission haru liney, tespachi sabai attempt haru liney, tespachi total right attempt, total attempt, accuracy percent calculate garne
    def _all_attempts(self, obj):
        submissions = Submissions.objects(user_guid=obj.user_guid)
        attempts = []
        for submission in submissions:
            attempts.extend(submission.attempts)
        return attempts

    def get_total_right_attempts(self, obj):
        attempts = self._all_attempts(obj)
        return sum(1 for attempt in attempts if attempt.is_correct)

    def get_total_attempts(self, obj):
        return len(self._all_attempts(obj))

    def get_accuracy_percent(self, obj):
        total_attempts = self.get_total_attempts(obj)
        if total_attempts == 0:
            return 0.0
        total_right_attempts = self.get_total_right_attempts(obj)
        return round(((total_right_attempts / total_attempts) * 100), 2)
    
    def get_completion_percent(self, obj):
        total_questions = Question.objects.count()
        if total_questions == 0:
            return 0.0
        attempted_question_ids = {str(attempt.question.id) for attempt in self._all_attempts(obj) if getattr(attempt, 'question', None)}
        return round((len(attempted_question_ids) / total_questions) * 100, 2)
    
    def get_roles(self, obj):
        return obj.get_roles()
    
class AttemptSerializer(me_serializers.EmbeddedDocumentSerializer):
    question = serializers.CharField(write_only=True)
    question_text = serializers.SerializerMethodField(read_only=True)
    # SHOW SELECTED OPTION LABELS IN LIST
    selected_options_labels = serializers.SerializerMethodField(read_only=True)
    categories = serializers.SerializerMethodField(read_only=True)
    subcategories = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Attempt
        fields = ('question', 'selected_answers','is_correct', 'question_text', 'selected_options_labels', 'categories', 'subcategories')
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
    
    def get_categories(self, obj):
        question = obj.question
        categories = set()
        for subcat in question.sub_categories:
            categories.add(subcat.category.name)
        return list(categories)
    def get_subcategories(self, obj):
        question = obj.question
        subcategories = set()
        for subcat in question.sub_categories:
            subcategories.add(subcat.name)
        return list(subcategories)

    def validate_question(self, value):
        print('value: ',value)
        return validate_object_id(value, model=Question, field_name="question")

    def validate(self, attrs):
        question = attrs['question']
        selected_answers = attrs['selected_answers']
        attrs['is_correct'] = validate_attempt_answers(question,selected_answers)
        return attrs

class SubmissionsSerializer(me_serializers.DocumentSerializer):
    submission_id = serializers.SerializerMethodField(read_only=True)
    selected_question_ids = serializers.SerializerMethodField(read_only=True)
    attempts = AttemptSerializer(many=True)
    # type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Submissions
        fields = ('submission_id','user_guid','selected_question_ids','attempts','status','started_at','submitted_at','type')

    def get_submission_id(self, obj):
        return str(obj.id)

    def get_selected_question_ids(self, obj):
        return [str(question.id) for question in obj.selected_questions if question]
    
    # method bata garda
    # def get_type(self, obj):
    #     return obj.type

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

class SubmissionSerializer(me_serializers.DocumentSerializer):
    submission_id = serializers.SerializerMethodField()
    detail = serializers.CharField(default="Submission recorded successfully")

    class Meta:
        model = Submissions
        fields = ('submission_id', 'status', 'submitted_at', 'detail')

    def get_submission_id(self, obj):
        return str(obj.id)

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('user', 'role', 'assigned_at')
        read_only_fields = ('id', 'assigned_at')

class AssignRoleSerializer(serializers.Serializer):
    role_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_role_ids(self, value):
        user = self.context.get("user")
        if not user:
            raise serializers.ValidationError("User context is required for role assignment.")
        for role_id in value:
            role = Role.objects.filter(id=role_id).first()
            if not role:
                raise serializers.ValidationError(f"Role with id {role_id} does not exist.")
            if role.name == ROLE_USER:
                raise serializers.ValidationError("USER role is virtual and cannot be assigned.")
            if UserRole.objects.filter(user=user, role=role).exists():
                raise serializers.ValidationError(f"User already has the role {role.name}.")
        return value

class RemoveRoleSerializer(serializers.Serializer):
    role_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_role_ids(self, value):
        user = self.context.get("user")
        if not user:
            raise serializers.ValidationError("User context is required for role removal.")
        for role_id in value:
            role = Role.objects.filter(id=role_id).first()
            if not role:
                raise serializers.ValidationError(f"Role with id {role_id} does not exist.")
            # DISABLE VIRTUAL ROLE REMOVAL
            if role.name == ROLE_USER:
                raise serializers.ValidationError("USER role is virtual and cannot be removed.")
            if not UserRole.objects.filter(user=user, role=role).exists():
                raise serializers.ValidationError(f"Role '{role.name}' is not assigned to this user.")
        return value
    
class BookmarkSerializer(me_serializers.EmbeddedDocumentSerializer):
    question_id = serializers.SerializerMethodField()

    class Meta:
        model = Bookmark
        # fields = ("question_id", "question_text", "created_at")
        fields = ("question_id", "created_at")

    def get_question_id(self, obj):
        return str(obj.question.id)