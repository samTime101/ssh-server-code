# Nove 6 Samip Regmi
# Paila models mai thyo, paila Question model vitra save() ra delete() method was overridden
from datetime import datetime
from mongoengine import signals
from .models import Question, QuestionClassification, SubCategory, Category
from core.cloudinary import delete_question_folder


# Question save hunu aagai, if question exists, we collect its sub_categories
def question_pre_save(sender, document, **kwargs):
    document.previous_subcategory_ids = set()
    if document.id:
        # check for question, loading only sub_categories field
        old_question = Question.objects(id=document.id).only('sub_categories').first()
        document.previous_subcategory_ids = {sc.id for sc in old_question.sub_categories}

# Save vaye paxi, Classificatio ma link ya unlink garne
def question_post_save(sender, document, **kwargs):
    previous_sc_ids = document.previous_subcategory_ids
    current_sc_ids = {sc.id for sc in document.sub_categories}
    to_add = current_sc_ids - previous_sc_ids
    to_remove =  previous_sc_ids - current_sc_ids

    for sc_id in to_add:
        QuestionClassification.objects(sub_category=sc_id).update_one(add_to_set__questions=document, upsert=True)

    for sc_id in to_remove:
        QuestionClassification.objects(sub_category=sc_id).update_one(pull__questions=document)

# Question delete huda unlink it from QuestionClassification and delete its image folder
def question_post_delete(sender, document, **kwargs):
    QuestionClassification.objects(questions=document).update(pull__questions=document, set__updated_at=datetime.utcnow())
    delete_question_folder(document.id)


def subcategory_post_delete(sender, document, **kwargs):
    for q in Question.objects(sub_categories=document):
        q.delete() 
    # After question delete , `question_post_delete` will be called and clean up auto hunxa
    QuestionClassification.objects(sub_category=document).delete()

# Cascade ma xa Subcategory ma so logs matra rakheko
def category_post_delete(sender, document, **kwargs):
    print(f"Category '{document.name}' deleted, Subcat ison cascade and questions on signals")

signals.pre_save.connect(question_pre_save, sender=Question)
signals.post_save.connect(question_post_save, sender=Question)
signals.post_delete.connect(question_post_delete, sender=Question)

signals.post_delete.connect(subcategory_post_delete, sender=SubCategory)
signals.post_delete.connect(category_post_delete, sender=Category)