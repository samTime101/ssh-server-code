import random
from collections import defaultdict
from rest_framework.exceptions import ValidationError

class ConstraintValidatorMixin:

    def validate_questions_against_constraint(self, questions, constraint):
        category_count = defaultdict(int)

        for q in questions:
            categories = set()

            for subcat in q.sub_categories:
                categories.add(str(subcat.category.id))
            for cat_id in categories:
                category_count[cat_id] += 1

        for rule in constraint.rules:
            cat_id = str(rule.category.id)
            required = rule.count
            actual = category_count.get(cat_id, 0)

            if actual < required:
                raise ValidationError(f"Category '{rule.category.name}': required {required}, got {actual}")

        total_required = sum(rule.count for rule in constraint.rules)

        if len(questions) != total_required:
            raise ValidationError(f"Total questions must be {total_required}, got {len(questions)}")