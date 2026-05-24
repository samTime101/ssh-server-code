# python manage.py reset_mongo , sabai mongo collections haru drop garxa
from django.core.management.base import BaseCommand
from mongo.models import Category, SubCategory, Question, QuestionClassification, Submissions, College, Bookmarks, QuestionSet


class Command(BaseCommand):
    help = "RESET MONGO DB BY DROPPING ALL COLLECTIONS"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Dropping all MongoDB collections..."))
        self.drop_collections()
        self.stdout.write(self.style.SUCCESS("All MongoDB collections dropped successfully."))

    def drop_collections(self):
        QuestionClassification.drop_collection()
        Question.drop_collection()
        SubCategory.drop_collection()
        Category.drop_collection()
        Submissions.drop_collection()
        Bookmarks.drop_collection()
        College.drop_collection()
        QuestionSet.drop_collection()
    
