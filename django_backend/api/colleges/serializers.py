from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import College

class CollegeSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = College
        fields = '__all__'
        extra_kwargs = {'id': {'read_only': True},'created_at': {'read_only': True},'updated_at': {'read_only': True}}