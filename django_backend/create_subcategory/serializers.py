# AUGUST 22
# SAMIP REGMI

from rest_framework import serializers
from sqldb_app.models import SubCategory

class CreateSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['categoryID','subCategoryId','subCategoryName']

    def create(self, validated_data):
        subcategory = SubCategory.objects.create(**validated_data)
        return subcategory
    
class SubCategoryDataSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='subCategoryId')
    name = serializers.CharField(source='subCategoryName')
    categoryId = serializers.IntegerField(source='categoryID.categoryId')
    categoryName = serializers.CharField(source='categoryID.categoryName')

class SubCategoryResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    subcategory = SubCategoryDataSerializer()