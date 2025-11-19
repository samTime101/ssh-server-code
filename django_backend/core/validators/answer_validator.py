from rest_framework import serializers

# def validate_attempt_answers(question, selected_answers):
#     valid_labels = [opt.label for opt in question.options]
#     for ans in selected_answers:
#         if ans not in valid_labels:
#             raise serializers.ValidationError(f"Selected answer '{ans}' is not a valid option for question {question.id}")
#     correct_labels = [opt.label for opt in question.options if opt.is_true]
#     return set(selected_answers) == set(correct_labels)

def validate_attempt_answers(question, selected_answers):
    invalid = set(selected_answers) - question.all_options()
    if invalid:
        raise serializers.ValidationError(f"Invalid answers for question {question.id}: {', '.join(invalid)}")
    return set(selected_answers) == question.correct_answers()
