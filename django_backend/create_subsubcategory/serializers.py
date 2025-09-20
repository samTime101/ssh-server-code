# REFACTORED ON SEP 20 2025
# SAMIP REGMI

from rest_framework import serializers
from sqldb_app.models import SubSubCategory

class CreateSubSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubSubCategory
        fields = ['subCategoryID', 'subSubCategoryId', 'subSubCategoryName']

    def create(self, validated_data):
        return SubSubCategory.objects.create(**validated_data)

class SubSubCategoryDataSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='subSubCategoryId')
    name = serializers.CharField(source='subSubCategoryName')
    subCategoryId = serializers.IntegerField(source='subCategoryID.subCategoryId')
    subCategoryName = serializers.CharField(source='subCategoryID.subCategoryName')

class SubSubCategoryResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    subsubcategory = SubSubCategoryDataSerializer()
