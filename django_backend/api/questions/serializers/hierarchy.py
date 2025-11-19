from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Category, SubCategory

class HierarchySubCategorySerializer(me_serializers.DocumentSerializer):
    question_count = serializers.IntegerField()
    id = serializers.CharField()
    class Meta:
        model = SubCategory
        fields = ('id','question_count','name')
        read_only_fields = fields

class HierarchyCategorySerializer(me_serializers.DocumentSerializer):
    question_count = serializers.IntegerField()
    id = serializers.CharField()
    sub_categories = serializers.ListField(child=HierarchySubCategorySerializer())
    class Meta:
        model = Category
        fields = ('id','question_count','sub_categories','name')
        read_only_fields = fields

class HierarchySerializer(serializers.Serializer):
    total_questions = serializers.IntegerField()
    categories = serializers.ListField(child=HierarchyCategorySerializer())
