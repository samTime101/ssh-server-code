import random
from core.constants.status import APPROVED_STATUS
from mongo.models import Question, SubCategory

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
        questions = list(Question.objects(status=APPROVED_STATUS))
    else:
        # collect ids
        sub_category_ids = list({sc.id for sc in result})
        # return question matching with id
        questions = list(Question.objects(sub_categories__in=sub_category_ids, status=APPROVED_STATUS))
        random.shuffle(questions)
    return questions   