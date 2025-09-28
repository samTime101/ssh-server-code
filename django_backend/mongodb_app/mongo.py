from datetime import datetime
from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, BooleanField
from mongoengine import connect
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
    category = StringField()        
    subCategory = ListField(StringField())
    subSubCategory = ListField(StringField())
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'questions'}


# SUBMISSION DOCUMENTS
class Submissions(EmbeddedDocument):
    questionId = StringField(required=True)
    selectedAnswers = ListField(StringField())
    isCorrect = BooleanField(required=True)
    attemptedAt = DateTimeField(default=datetime.utcnow)
    description = StringField()

class SubmissionCollection(Document):
    userId = StringField(required=True)
    attempts = ListField(EmbeddedDocumentField(Submissions))
    started_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'user_attempts'}
