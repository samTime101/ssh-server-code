# SAMIP REGMI
# AUGUST 23
# MODIFIED AUGUST 25

from rest_framework import serializers
from mongodb_app.mongo import Option, Question
from sqldb_app.models import Category, SubCategory, SubSubCategory  # SQL models

class OptionSerializer(serializers.Serializer):
    optionId = serializers.CharField(required=True)
    text = serializers.CharField(required=True)

class QuestionDataSerializer(serializers.Serializer):
    questionText = serializers.CharField(required=True)
    questionType = serializers.ChoiceField(choices=["single", "multiple"], required=True)
    description = serializers.CharField(required=False, allow_blank=False)
    options = OptionSerializer(many=True, required=True)
    correctAnswers = serializers.ListField(child=serializers.CharField(), required=True)
    difficulty = serializers.ChoiceField(choices=["easy", "medium", "hard"], default="easy")
    categoryId = serializers.IntegerField(required=True)
    subCategoryId = serializers.ListField(child=serializers.IntegerField(), required=True)
    subSubCategoryId = serializers.ListField(child=serializers.IntegerField(), required=True)

    def validate_options(self, value):
        """Validate that there are exactly 4 options"""
        if len(value) != 4:
            raise serializers.ValidationError("Exactly 4 options are required.")
        return value

class CreateQuestionSerializer(serializers.Serializer):
    questionData = QuestionDataSerializer(required=True)

    def create(self, validated_data):
        
        question_data = validated_data.get("questionData", {})
        
        category_id = question_data.get("categoryId")
        sub_category_ids = question_data.get("subCategoryId", [])
        sub_sub_category_ids = question_data.get("subSubCategoryId", [])

        # GET NAMES FROM SQL
        category_name = None
        if category_id:
            try:
                category = Category.objects.get(categoryId=category_id)
                category_name = category.categoryName
            except Category.DoesNotExist:
                raise serializers.ValidationError(f"Category with ID {category_id} does not exist.")

        # GET SUBCATEGORY NAMES
        subcategory_names = []
        if sub_category_ids:
            subcategories = SubCategory.objects.filter(subCategoryId__in=sub_category_ids)
            subcategory_names = list(subcategories.values_list('subCategoryName', flat=True))
            
            # Validate that all requested subcategories exist
            # if len(subcategory_names) != len(sub_category_ids):
            #     found_ids = list(subcategories.values_list('subCategoryId', flat=True))
            #     missing_ids = set(sub_category_ids) - set(found_ids)
            #     raise serializers.ValidationError(f"SubCategories with IDs {missing_ids} do not exist.")

        # GET SUBSUBCATEGORY NAMES
        subsubcategory_names = []
        if sub_sub_category_ids:
            subsubcategories = SubSubCategory.objects.filter(subSubCategoryId__in=sub_sub_category_ids)
            subsubcategory_names = list(subsubcategories.values_list('subSubCategoryName', flat=True))
            
            # Validate that all requested subsubcategories exist
            # if len(subsubcategory_names) != len(sub_sub_category_ids):
            #     found_ids = list(subsubcategories.values_list('subSubCategoryId', flat=True))
            #     missing_ids = set(sub_sub_category_ids) - set(found_ids)
            #     raise serializers.ValidationError(f"SubSubCategories with IDs {missing_ids} do not exist.")

        # Create the question in MongoDB
        question = Question(
            questionText=question_data["questionText"],
            description=question_data.get("description"), # THE DEFAULT DESCRIPTION IS EMPTY
            questionType=question_data["questionType"],
            options=question_data["options"],
            correctAnswers=question_data["correctAnswers"],
            difficulty=question_data["difficulty"],
            category=category_name,
            subCategory=subcategory_names,
            subSubCategory=subsubcategory_names
        )
        
        # SAVE TO MONGO
        question.save()
        return question

    def to_representation(self, instance):
        """Convert the MongoDB instance back to the expected JSON format"""
        return {
            'questionData': {
                'questionText': instance.questionText,
                'description': instance.description,
                'questionType': instance.questionType,
                'options': instance.options,
                'correctAnswers': instance.correctAnswers,
                'difficulty': instance.difficulty,
                'categoryId': self.context.get('categoryId'),  # You might need to store this
                'subCategoryId': self.context.get('subCategoryId'),  # You might need to store this
                'subSubCategoryId': self.context.get('subSubCategoryId')  # You might need to store this
            }
        }


# # SAMIP REGMI
# # AUGUST 23

# # MODIFIED AUGUST 25

# # TODO: https://stackoverflow.com/questions/27896603/how-to-validate-the-length-of-nested-items-in-a-serializer
# # RESRTICT TO ONLY 4 OPTIONS 


# from rest_framework import serializers
# from mongodb_app.mongo import Option, Question
# from sqldb_app.models import Category, SubCategory, SubSubCategory  # SQL models

# # ADDING REQUIREED TRUE SO THAT IT DOES NOT ACCEPT NULL



# class OptionSerializer(serializers.Serializer):
#     optionId = serializers.CharField(required=True)
#     text = serializers.CharField(required=True)



# class CreateQuestionSerializer(serializers.Serializer):
#     print("The json comes here")
#     questionText = serializers.CharField(required=True)
#     questionType = serializers.ChoiceField(choices=["single", "multiple"], required=True)
#     options = OptionSerializer(many=True, required=True)
#     correctAnswers = serializers.ListField(child=serializers.CharField(), required=True)
#     # DEFAULT EASY
#     difficulty = serializers.ChoiceField(choices=["easy", "medium", "hard"], default="easy")

#     categoryId = serializers.IntegerField(required=True)
#     # THE ELEMENT INSIDE LIST SHALL BE INTEGER
#     subCategoryId = serializers.ListField(child=serializers.IntegerField(), required=True)
#     # SAME HERE INT
#     subSubCategoryId = serializers.ListField(child=serializers.IntegerField(), required=True)

#     def create(self, validated_data):
#         category_id = validated_data.get("categoryId")
#         sub_category_ids = validated_data.get("subCategoryId", [])
#         sub_sub_category_ids = validated_data.get("subSubCategoryId", [])

#         # GET NAMES FROM SQL

#         # SELECT CATEGORY NAME FROM CATEGORY WHERE categoryId = category_id
#         if category_id:
#             category_name = Category.objects.get(categoryId=category_id).categoryName

#         # SELECT SUBCATEGORY NAMES FROM SUBCATEGORY WHERE subCategoryId IN (<sub_category_ids>) 
#         # IN LIST FORM
#         subcategory_names = list(
#             SubCategory.objects.filter(subCategoryId__in=sub_category_ids)
#             .values_list('subCategoryName', flat=True)
#         )
        
#         # SELECT SUBSUBCATEGORY NAMES FROM SUBSUBCATEGORY WHERE subSubCategoryId IN (<sub_sub_category_ids>)
#         subsubcategory_names = list(
#             SubSubCategory.objects.filter(subSubCategoryId__in=sub_sub_category_ids)
#             .values_list('subSubCategoryName', flat=True)
#         )

#         question = Question(
#             questionText=validated_data["questionText"],
#             questionType=validated_data["questionType"],
#             options=validated_data["options"],
#             correctAnswers=validated_data["correctAnswers"],
#             difficulty=validated_data["difficulty"],
#             category=category_name,
#             subCategory=subcategory_names,
#             subSubCategory=subsubcategory_names
#         )
#         # SAVE TO MONGO
#         question.save()
#         return question
    

# class QuestionSerializer(serializers.Serializer):
#     questionData = CreateQuestionSerializer()