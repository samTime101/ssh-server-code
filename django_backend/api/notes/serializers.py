# api/notes/serializers.py
from rest_framework_mongoengine.serializers import DocumentSerializer
from mongo.models import QuestionNote

class QuestionNoteSerializer(DocumentSerializer):

    class Meta:
        model = QuestionNote
        fields = ('id', 'note')
        extra_kwargs = {'id': {'read_only': True}, 'note': {'required': True}}