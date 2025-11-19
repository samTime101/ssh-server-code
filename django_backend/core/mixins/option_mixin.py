from rest_framework import serializers

class OptionValidationMixin:
    # option validation mixin
    def validate_options(self, value):
        # user given option must be unique ani minimum eeuta option hunu parxa
        if not value:
            raise serializers.ValidationError("At least one option is required")
        labels = [opt['label'] for opt in value]
        # duplicate labels check
        if len(labels) != len(set(labels)):
            raise serializers.ValidationError("Option labels must be unique")
        return value

    def validate_option_types(self, option_type, options):
        # sabai option ma is_true vanne key nahuna sakxa, if xaina vane continue hunxa instead of key error
        # jaha xa teslai sum hunxa
        correct_count = sum(1 for opt in options if opt.get('is_true', False)) 
        if correct_count == 0:
            raise serializers.ValidationError("At least one option must be marked as correct")
        if option_type == 'single' and correct_count > 1:
            raise serializers.ValidationError("Single choice questions can only have one correct answer")
