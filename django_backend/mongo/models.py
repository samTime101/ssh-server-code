# SAMIP REGMI
# NOV1 2025

from datetime import datetime
from dotenv import load_dotenv
from mongoengine import *
import os
from .base import TimeStampedDocument
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
connect(host=mongo_uri)

class Category(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    meta = {'collection': 'categories'}

class SubCategory(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    category = ReferenceField(Category, required=True, reverse_delete_rule=CASCADE)
    meta = {'collection': 'sub_categories','indexes': ['category']}

class Option(EmbeddedDocument):
    label = StringField(required=True, max_length=5)
    text = StringField(required=True)
    is_true = BooleanField(default=False)

class Question(TimeStampedDocument):
    question_text = StringField(required=True)
    option_type = StringField(required=True, choices=["single", "multiple"])
    options = ListField(EmbeddedDocumentField(Option))
    description = StringField()
    difficulty = StringField(choices=["easy", "medium", "hard"], default="easy")
    sub_categories = ListField(ReferenceField(SubCategory))
    image_url = StringField(required=False)
    
    meta = {'collection': 'questions','indexes': ['sub_categories']}

    def correct_answers(self):
        return {opt.label for opt in self.options if opt.is_true}
    
    def all_options(self):
        return {opt.label for opt in self.options}

    def get_subcategory_ids(self):
        return [str(subcat.id) for subcat in self.sub_categories]

class QuestionClassification(TimeStampedDocument):
    sub_category = ReferenceField(SubCategory, required=True, unique=True)
    questions = ListField(ReferenceField(Question))
    
    meta = {'collection': 'question_classifications','indexes': ['sub_category']}

class Attempt(EmbeddedDocument):
    question = ReferenceField(Question,required=True)
    selected_answers = ListField(StringField())
    is_correct = BooleanField(required=True)
    attempted_at = DateTimeField(default=datetime.utcnow)

class Submissions(Document):
    user_guid = UUIDField(required=True, unique=True, binary=False)
    attempts = ListField(EmbeddedDocumentField(Attempt))
    started_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'user_submissions'}