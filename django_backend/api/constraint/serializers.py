from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from rest_framework_mongoengine.validators import UniqueValidator
from core.constants.status import APPROVED_STATUS
from core.validators.obj_ids_validator import validate_object_ids
from core.validators.obj_id_validator import validate_object_id
from mongo.models import Category, Constraint, ConstraintRule, Question


class ConstraintRuleSerializer(serializers.Serializer):
    category = serializers.CharField(write_only=True)
    category_id = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.SerializerMethodField(read_only=True)
    count = serializers.IntegerField(min_value=1)

    def validate_category(self, value):
        return validate_object_id(value, Category, "category")

    def get_category_id(self, obj):
        category = obj.get("category") if isinstance(obj, dict) else getattr(obj, "category", None)
        return str(category.id) if category else None

    def get_category_name(self, obj):
        category = obj.get("category") if isinstance(obj, dict) else getattr(obj, "category", None)
        return category.name if category else None


class ConstraintSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=Constraint.objects.all())])
    rules = ConstraintRuleSerializer(many=True)

    class Meta:
        model = Constraint
        fields = ["id", "name", "rules", "created_at", "updated_at"]
        extra_kwargs = {"created_at": {"read_only": True},"updated_at": {"read_only": True},}

    def validate_rules(self, value):
        if not value:
            raise serializers.ValidationError("At least one rule is required.")

        seen = set()
        for rule in value:
            category_obj = rule.get("category")
            category_id = str(category_obj.id)
            if category_id in seen:
                raise serializers.ValidationError("Duplicate categories are not allowed in rules.")
            seen.add(category_id)
        return value

    def _build_rules(self, rules_payload):
        return [ConstraintRule(category=rule["category"], count=rule["count"]) for rule in rules_payload]

    def create(self, validated_data):
        rules_payload = validated_data.pop("rules", [])
        constraint = Constraint(**validated_data)
        constraint.rules = self._build_rules(rules_payload)
        constraint.save()
        return constraint

    def update(self, instance, validated_data):
        rules_payload = validated_data.pop("rules", None)
        instance.name = validated_data.get("name", instance.name)
        if rules_payload is not None:
            instance.rules = self._build_rules(rules_payload)
        instance.save()
        return instance


class ConstraintValidateSerializer(serializers.Serializer):
    question_ids = serializers.ListField(child=serializers.CharField(), required=True)

    def validate_question_ids(self, value):
        question_ids = validate_object_ids(value, Question, "question_ids", allow_empty=False)
        questions = Question.objects(id__in=question_ids, status=APPROVED_STATUS)
        if len(questions) != len(set(question_ids)):
            raise serializers.ValidationError("Some questions are invalid or not approved.")
        return questions
