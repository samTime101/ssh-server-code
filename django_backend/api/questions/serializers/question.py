from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from core.mixins.option_mixin import OptionValidationMixin
from core.mixins.image_mixin import ImageHandlerMixin
from core.validators.obj_ids_validator import validate_object_ids
from mongo.models import Question, Option, SubCategory

class OptionSerializer(me_serializers.EmbeddedDocumentSerializer):
    # HIDE IS_TRUE IN RESPONSES
    class Meta:
        model = Option
        # admin lai `is_true` write read dubai enabled
        fields = ('label', 'text','is_true')
        # extra_kwargs = {'is_true': {'write_only': True}}

class QuestionSerializer(me_serializers.DocumentSerializer,OptionValidationMixin,ImageHandlerMixin,):
    id = serializers.CharField(read_only=True)
    options = OptionSerializer(many=True)
    sub_categories = serializers.ListField(child=serializers.CharField(),write_only=True,required=True,allow_null=False)   
    image_unchanged = serializers.BooleanField(write_only=True, required=False, default=True)
    sub_categories_ids = serializers.SerializerMethodField(read_only=True) # get_subcategory_ids lai call garxa (default)
    category_names = serializers.SerializerMethodField(read_only=True)
    subcategory_names = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Question
        fields = ('id','question_text','option_type','options','description','difficulty','sub_categories','image_url','image_unchanged','sub_categories_ids','created_at','updated_at','category_names','subcategory_names')
        extra_kwargs = {'created_at': {'read_only': True},'updated_at': {'read_only': True},'image_url': {'read_only': True}}
        
    def validate_sub_categories(self, value):
        return validate_object_ids(value,SubCategory,'sub_categories',allow_empty=False)
    
    def validate_options(self, value):
        # extended the default method
        return super().validate_options(value)
    
    def validate(self, attrs):
        # Validate option type (single/multiple)
        option_type = attrs.get('option_type')
        options = attrs.get('options', [])
        self.validate_option_types(option_type, options)
        return attrs

    def get_sub_categories_ids(self, obj):
        return obj.get_subcategory_ids()
    
    def get_category_names(self, obj):
        return obj.get_category_names()
    
    def get_subcategory_names(self, obj):
        return obj.get_subcategory_names()

    def create(self, validated_data):
        image_file = self.context['request'].FILES.get('image')
        validated_data.pop('image_unchanged', None)
        sc_ids = validated_data.pop('sub_categories')
        options_data = validated_data.pop('options', [])
        sub_categories = SubCategory.objects(id__in=sc_ids)
        options = [Option(**opt_data) for opt_data in options_data]
        question = Question(**validated_data)
        question.options = options
        question.sub_categories = list(sub_categories)
        question = self.handle_image_create(question, image_file)
        question.save()
        return question
    
    def update(self, instance, validated_data):
        image_file = self.context['request'].FILES.get('image')
        image_unchanged = validated_data.pop('image_unchanged') 
        image_leave_unchanged = image_unchanged and (image_file is None)
        sc_ids = validated_data.pop('sub_categories', None)
        options_data = validated_data.pop('options', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if options_data is not None:
            options = [Option(**opt_data) for opt_data in options_data]
            instance.options = options
        if sc_ids is not None:
            sub_categories = SubCategory.objects(id__in=sc_ids)
            instance.sub_categories = list(sub_categories)
        instance = self.handle_image_update(instance,image_file, leave_unchanged=image_leave_unchanged)
        instance.save()
        return instance
    
# selection ko lagi, yo chai user le access garna paune vayekale
class OptionPublicSerializer(me_serializers.EmbeddedDocumentSerializer):
    class Meta:
        model = Option
        fields = ('label', 'text')


class QuestionPublicSerializer(QuestionSerializer):
    options = OptionPublicSerializer(many=True)