from datetime import datetime
from mongoengine import *
# MODIFIED ON SEP 11 , SAMIP REGMI
import os
from dotenv import load_dotenv

# CONNECTION TO MONGO DB IS NOW ON .ENV FILE
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
connect(host=mongo_uri)

# OPTION EMBEDDED DOCUMENT
class Option(EmbeddedDocument):
    optionId = StringField(required=True, max_length=5)
    text = StringField(required=True)

# QUESTION DOCUMENT
class Question(Document):
    questionText = StringField(required=True)
    questionType = StringField(required=True, choices=["single", "multiple"])
    options = ListField(EmbeddedDocumentField(Option))
    correctAnswers = ListField(StringField())  
    description = StringField()
    difficulty = StringField(choices=["easy", "medium", "hard"], default="easy")
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'questions'}

class QuestionCategorization(Document):
    categories = ListField(StringField(), required=True)
    subCategories = ListField(StringField())
    subSubCategories = ListField(StringField())
    questions = ListField(ReferenceField(Question))
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'question_categorizations'}


# SUBMISSION DOCUMENTS
class Submissions(EmbeddedDocument):
    question = ReferenceField(Question,required=True)
    selectedAnswers = ListField(StringField())
    isCorrect = BooleanField(required=True)
    attemptedAt = DateTimeField(default=datetime.utcnow)
    description = StringField()

class SubmissionCollection(Document):
    userGuid = UUIDField(required=True, unique=True, binary=False)
    attempts = ListField(EmbeddedDocumentField(Submissions))
    started_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'user_attempts'}
