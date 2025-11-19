from django.core.management.base import BaseCommand
from mongo.models import Category, SubCategory, Question, Option, QuestionClassification

# python manage.py seed_questions garera bulk question , cat, sub cli bata insert garna milxa
class Command(BaseCommand):
    help = "SEED MONGO WITH SOME QUESTIONS, CATEGORIES, AND SUBCATEGORIES"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Clearing old data..."))
        self.clear_collections()

        self.stdout.write(self.style.NOTICE("Creating categories and subcategories..."))
        self.create_categories_and_subcategories()

        self.stdout.write(self.style.NOTICE("Creating questions one by one..."))
        self.create_questions()

        self.stdout.write(self.style.SUCCESS("Seeding complete!"))

    def clear_collections(self):
        QuestionClassification.drop_collection()
        Question.drop_collection()
        SubCategory.drop_collection()
        Category.drop_collection()

    def create_categories_and_subcategories(self):
        physics = Category(name="Physics").save()
        mechanics = SubCategory(name="Mechanics", category=physics).save()
        thermodynamics = SubCategory(name="Thermodynamics", category=physics).save()
        optics = SubCategory(name="Optics", category=physics).save()

        chemistry = Category(name="Chemistry").save()
        organic = SubCategory(name="Organic Chemistry", category=chemistry).save()
        inorganic = SubCategory(name="Inorganic Chemistry", category=chemistry).save()
        physical = SubCategory(name="Physical Chemistry", category=chemistry).save()

        math = Category(name="Mathematics").save()
        algebra = SubCategory(name="Algebra", category=math).save()
        calculus = SubCategory(name="Calculus", category=math).save()
        geometry = SubCategory(name="Geometry", category=math).save()

        english = Category(name="English").save()
        grammar = SubCategory(name="Grammar", category=english).save()
        vocabulary = SubCategory(name="Vocabulary", category=english).save()
        literature = SubCategory(name="Literature", category=english).save()

        cs = Category(name="Computer Science").save()
        programming = SubCategory(name="Programming", category=cs).save()
        data_structures = SubCategory(name="Data Structures", category=cs).save()
        databases = SubCategory(name="Databases", category=cs).save()

        self.stdout.write(self.style.SUCCESS("Categories and Subcategories created successfully"))

    def create_questions(self):
        mechanics = SubCategory.objects.get(name="Mechanics")
        programming = SubCategory.objects.get(name="Programming")
        calculus = SubCategory.objects.get(name="Calculus")
        grammar = SubCategory.objects.get(name="Grammar")
        databases = SubCategory.objects.get(name="Databases")

        q1 = Question(
            question_text="What is Newton's Second Law of Motion?",
            description="Basic Physics law question",
            difficulty="easy",
            option_type="single",
            sub_categories=[mechanics],
            options=[
                Option(label="A", text="F = ma", is_true=True),
                Option(label="B", text="E = mc^2", is_true=False),
                Option(label="C", text="V = IR", is_true=False),
                Option(label="D", text="P = IV", is_true=False),
            ],
        ).save()

        q2 = Question(
            question_text="Which of the following is a programming language?",
            description="Computer Science question",
            difficulty="medium",
            option_type="single",
            sub_categories=[programming],
            options=[
                Option(label="A", text="Python", is_true=True),
                Option(label="B", text="HTML", is_true=False),
                Option(label="C", text="CSS", is_true=False),
                Option(label="D", text="HTTP", is_true=False),
            ],
        ).save()

        q3 = Question(
            question_text="Choose all that are prime numbers.",
            description="Mathematics question",
            difficulty="medium",
            option_type="multiple",
            sub_categories=[calculus],
            options=[
                Option(label="A", text="2", is_true=True),
                Option(label="B", text="3", is_true=True),
                Option(label="C", text="4", is_true=False),
                Option(label="D", text="5", is_true=True),
            ],
        ).save()

        q4 = Question(
            question_text="Select the correct past tense forms of 'go'.",
            description="English grammar question",
            difficulty="easy",
            option_type="single",
            sub_categories=[grammar],
            options=[
                Option(label="A", text="Gone", is_true=False),
                Option(label="B", text="Went", is_true=True),
                Option(label="C", text="Goed", is_true=False),
                Option(label="D", text="Go", is_true=False),
            ],
        ).save()

        q5 = Question(
            question_text="Which of the following are database systems?",
            description="Databases question",
            difficulty="medium",
            option_type="multiple",
            sub_categories=[databases],
            options=[
                Option(label="A", text="MySQL", is_true=True),
                Option(label="B", text="PostgreSQL", is_true=True),
                Option(label="C", text="MongoDB", is_true=True),
                Option(label="D", text="React", is_true=False),
            ],
        ).save()

        self.stdout.write(self.style.SUCCESS(" All 5 questions created successfully."))
