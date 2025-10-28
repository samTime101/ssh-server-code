# SAMIP REGMI
# OCTOBER 12 2025

from mongoengine import *
from mongodb_app.mongo import Question, QuestionCategorization
from datetime import datetime

class QuestionCategoryManager:
    def __init__(self, question: Question, categories: list, subCategories: list = None, subSubCategories: list = None):
        if not categories:
            raise ValueError("Empty categories list is not allowed")
        self.question = question
        self.categories = categories
        self.subCategories = subCategories or []
        self.subSubCategories = subSubCategories or []

    def create_or_amend_question_categorization(self):
        # IF CATEGORIZATION EXISTS FOR THE GIVEN CATEGORIES, SUBCATEGORIES, SUBSUBCATEGORIES
        # IF CATEGORIZATION EXISTS BUT QUESTION NOT IN IT, ADD THE QUESTION
        categorization = QuestionCategorization.objects(
            categories=self.categories,
            subCategories=self.subCategories,
            subSubCategories=self.subSubCategories
        ).first()
        if categorization:
            if self.question not in categorization.questions:
                categorization.questions.append(self.question)
                categorization.updatedAt = datetime.utcnow()
                categorization.save()
        else:
            # CREATE NEW CATEGORIZATION
            new_categorization = QuestionCategorization(
                categories=self.categories,
                subCategories=self.subCategories,
                subSubCategories=self.subSubCategories,
                questions=[self.question],
                createdAt=datetime.utcnow(),
                updatedAt=datetime.utcnow()
            )
            new_categorization.save()

    def update(self):
        self.create_or_amend_question_categorization()

