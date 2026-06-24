#api/comments/serializers.py
from rest_framework_mongoengine.serializers import DocumentSerializer
from rest_framework import serializers
from mongo.models import Comment
from sql.models import User

class CommentSerializer(DocumentSerializer):
    parent_comment = serializers.CharField(required=False, allow_null=True, write_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'question', 'parent_comment', 'text', 'created_at', 'updated_at', 'user_name')
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def get_user_name(self, obj):
        try:
            # Maybe inefficient for multiple comments, but ok for now.
            # We will handle bulk optimization in the view.
            return "User" 
        except:
            return "User"

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user_guid'] = user.user_guid
        parent_comment_id = validated_data.pop('parent_comment', None)
        if parent_comment_id:
            try:
                from mongoengine.errors import ValidationError as MongoValidationError
                parent_comment = Comment.objects.get(id=parent_comment_id)
                validated_data['parent_comment'] = parent_comment
            except (Comment.DoesNotExist, MongoValidationError):
                raise serializers.ValidationError({"parent_comment": "Parent comment does not exist or invalid ID."})

        return super().create(validated_data)
