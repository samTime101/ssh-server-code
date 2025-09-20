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
