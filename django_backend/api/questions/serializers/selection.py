from rest_framework import serializers
from mongo.models import Category, SubCategory
from core.mixins.selection_mixin import SelectionValidationMixin
from core.validators.obj_ids_validator import validate_object_ids
# from .question import QuestionSerializer

class WrongOnlyQuerySerializer(serializers.Serializer):
    wrong_only = serializers.BooleanField(required=False, default=False)

class QuestionSelectionSerializer(serializers.Serializer, SelectionValidationMixin):
    category_ids = serializers.ListField(child=serializers.CharField(),required=False,allow_empty=True,default=list)
    sub_category_ids = serializers.ListField(child=serializers.CharField(),required=False,allow_empty=True,default=list)
    
    def validate_category_ids(self, value):
        return validate_object_ids(value,Category,'category_ids')
    
    def validate_sub_category_ids(self, value):
        return validate_object_ids(value,SubCategory,'sub_category_ids')

    def validate(self, attrs):
        category_ids = attrs.get('category_ids', [])
        sub_category_ids = attrs.get('sub_category_ids', [])
        self.validate_category_selection(category_ids,sub_category_ids)
        return attrs
