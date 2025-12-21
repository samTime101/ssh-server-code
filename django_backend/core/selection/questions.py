import random
from mongo.models import Question, SubCategory, Submissions


def selected_questions(
        category_ids,
        sub_category_ids,
          ) -> list[Question]:
    result = []
    if category_ids:
        # Collect all subcategories under given category
        result.extend(SubCategory.objects(category__in=category_ids))
    if sub_category_ids:
        # collect given subcat
        result.extend(SubCategory.objects(id__in=sub_category_ids))
    if not category_ids and not sub_category_ids:
        questions = Question.objects().all()
    else:
        # collect ids
        sub_category_ids = list({sc.id for sc in result})
        # return question matching with id
        questions = Question.objects(sub_categories__in=sub_category_ids)
        random.shuffle(questions)
    return list(questions)    