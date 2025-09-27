# REFACTORED ON SEP 20
# SAMIP REGMI

from rest_framework import serializers
from sqldb_app.models import Category
from rest_framework.response import Response


class CreateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['categoryId','categoryName']

    def create(self,validated_data):
        category = Category.objects.create(**validated_data)
        return category


class CategoryDataSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='categoryId')
    name = serializers.CharField(source='categoryName')

class CategoryResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    category = CategoryDataSerializer()