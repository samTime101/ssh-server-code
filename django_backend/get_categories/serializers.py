from rest_framework import serializers


class SubSubCategoryItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    question_count = serializers.IntegerField()


class SubCategoryItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    question_count = serializers.IntegerField()
    subSubCategories = SubSubCategoryItemSerializer(many=True)


class CategoryItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    question_count = serializers.IntegerField()
    subCategories = SubCategoryItemSerializer(many=True)


class GetCategoriesResponseSerializer(serializers.Serializer):
    total_question_count = serializers.IntegerField()
    categories = CategoryItemSerializer(many=True)
