from rest_framework import serializers
# serializer naam ko duita huda me_serializer (mongo_engine ) vanera import gareko
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Category, SubCategory
from core.validators.obj_id_validator import validate_object_id

class CategorySerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Category
        fields = '__all__'
        extra_kwargs = {'id': {'read_only': True},'created_at': {'read_only': True},'updated_at': {'read_only': True}}

class SubCategorySerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    category = serializers.SerializerMethodField()
    class Meta:
        model = SubCategory
        fields = '__all__'
        extra_kwargs = { 'created_at': {'read_only': True},'updated_at': {'read_only': True},'id': {'read_only': True}}
    def validate_category(self, value):
        return validate_object_id(value,Category,"category")
    
    def get_category(self, obj):
        return str(obj.category.name)