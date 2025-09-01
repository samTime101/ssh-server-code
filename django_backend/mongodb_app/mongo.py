from datetime import datetime
from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, BooleanField
from mongoengine import connect

connect(db='mcq_db', host='localhost', port=27017)

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
    difficulty = StringField(choices=["easy", "medium", "hard"], default="easy") #DEFAULT MA EASY
    category = StringField()        
    # ACCEPT MULTIPLE CATEGORIES AND SUBCATEGORIES
    subCategory = ListField(StringField())
    subSubCategory = ListField(StringField())
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'questions'}

class Submissions(EmbeddedDocument):
    questionId = StringField(required=True)
    selectedAnswers = ListField(StringField())
    isCorrect = BooleanField(required=True)
    attemptedAt = DateTimeField(default=datetime.utcnow)

class SubmissionCollection(Document):
    userId = StringField(required=True)
    answers = ListField(EmbeddedDocumentField(Submissions))
    started_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'user_attempts'}
    
# DUMMY DATA
# question = Question(
#     questionText="Which of the following are valid data types in Java?",
#     questionType="multiple",
#     options=[
#         Option(optionId="A", text="int"),
#         Option(optionId="B", text="char"),
#         Option(optionId="C", text="boolean"),
#         Option(optionId="D", text="string"),
#     ],
#     correctAnswers=["A", "B", "C"],
#     difficulty="easy",
#     category="Computer Science",
#     subCategory="Programming",
#     subSubCategory="Java",
#     createdAt=datetime.utcnow(), # BOTH ARE DEFAULT IN CASE
#     updatedAt=datetime.utcnow()
# )