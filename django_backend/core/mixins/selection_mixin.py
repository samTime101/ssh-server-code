from rest_framework import serializers
from mongo.models import SubCategory

# Yo file chai question selection ma use vako xa
# allow empty chai required thena tara paxi aru apps ma use huna sakxa vanera add gareko
# allow_empty=True question selection ma hunxa because kehi sub_category ya
# sub_category deko xaina vaney sabai question return hunxa

class SelectionValidationMixin:
    def validate_category_selection(self, category_ids,sub_category_ids, allow_empty=True):
        if not (category_ids or sub_category_ids):
            if allow_empty:
                return
            else:
                raise serializers.ValidationError("At least one of category_ids or sub_category_ids must be provided")
        
        # conflicts vankeo
        # suppose PHYSICS is category ra MECHANICS is sub-category of PHYSICS
        # user le PHYSICS ko id category_ids ma ra MECHANICS ko id sub_category_ids ma dina paudaina
        # if deko xa vane error aauxa

        conflicts = []
        if category_ids and sub_category_ids:
            conflicting_subs = SubCategory.objects.filter(id__in=sub_category_ids,category__in=category_ids)
            if conflicting_subs:
                sub_names = [sc.name for sc in conflicting_subs]
                cat_names = list({sc.category.name for sc in conflicting_subs})
                conflicts.append(
                    f"Cannot select both category and its sub-categories. "
                    f"Sub-categories {sub_names} belong to selected categories {cat_names}"
                )
        if conflicts:
            raise serializers.ValidationError({"selection_conflict": conflicts})