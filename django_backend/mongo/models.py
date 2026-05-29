# SAMIP REGMI
# NOV1 2025

from datetime import datetime
from dotenv import load_dotenv
from mongoengine import *
import os
from .base import TimeStampedDocument
from core.constants.status import APPROVED_STATUS, IN_PROGRESS_STATUS, QUESTION_STATUSES, SUBMISSION_STATUSES
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
connect(host=mongo_uri)

class Category(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    status = StringField(required=True, choices=QUESTION_STATUSES, default=APPROVED_STATUS)
    meta = {'collection': 'categories'}

class SubCategory(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    category = ReferenceField(Category, required=True, reverse_delete_rule=CASCADE)
    status = StringField(required=True, choices=QUESTION_STATUSES, default=APPROVED_STATUS)
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
    contributor = StringField(required=False)
    contributor_specialization = StringField(required=False)
    question_image_url = StringField(required=False)
    description_image_url = StringField(required=False)
    status = StringField(required=True, choices=QUESTION_STATUSES, default=APPROVED_STATUS)
    meta = {'collection': 'questions','indexes': ['sub_categories']}

    def correct_answers(self):
        return {opt.label for opt in self.options if opt.is_true}
    
    def all_options(self):
        return {opt.label for opt in self.options}

    def get_subcategory_ids(self):
        return [str(subcat.id) for subcat in self.sub_categories]
    
    # extra safe huna set ma
    def get_category_names(self):
        return list({subcat.category.name for subcat in self.sub_categories})

    def get_subcategory_names(self):
        return [subcat.name for subcat in self.sub_categories]

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
    user_guid = UUIDField(required=True, binary=False)
    selected_questions = ListField(ReferenceField(Question), default=list)
    attempts = ListField(EmbeddedDocumentField(Attempt))
    status = StringField(required=True, choices=SUBMISSION_STATUSES, default=IN_PROGRESS_STATUS)
    started_at = DateTimeField(default=datetime.utcnow)
    type = StringField(required=True,default="question_bank")
    submitted_at = DateTimeField(required=False, null=True)

    meta = {'collection': 'user_submissions','indexes': ['user_guid', 'status', '-started_at']}

class College(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    city = StringField(required=True)
    state = StringField(required=True)
    country = StringField(required=True)
    postal_code = StringField(required=True)
    meta = {'collection': 'colleges'}

class Bookmark(EmbeddedDocument):
    question = ReferenceField(Question, required=True)
    created_at = DateTimeField(default=datetime.utcnow)

class Bookmarks(TimeStampedDocument):
    user_guid = UUIDField(required=True, binary=False)
    bookmark = ListField(EmbeddedDocumentField(Bookmark))
    
    meta = {'collection': 'bookmarks','indexes': ['user_guid', 'bookmark.question']}

class QuestionSet(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    description = StringField()
    questions = ListField(ReferenceField(Question))
    meta = {'collection': 'question_sets','indexes': ['questions']}

class ConstraintRule(EmbeddedDocument):
    category = ReferenceField(Category, required=True)
    count = IntField(required=True, min_value=1)

class Constraint(TimeStampedDocument):
    name = StringField(required=True, unique=True)
    rules = EmbeddedDocumentListField(ConstraintRule)

    meta = {'collection': 'constraints','indexes': ['rules.sub_category']}


class QuestionNote(TimeStampedDocument):
    question = ReferenceField(Question, required=True)
    user_guid = UUIDField(required=True, binary=False)
    note = StringField(required=True)

    meta = {'collection': 'question_notes','indexes': ['question', 'user_guid']}