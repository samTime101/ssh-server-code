# Nov 2
# Samip Regmi
# Selection file
# Endpoint /api/question/select_questions

import random
from mongo.models import Question, SubCategory, Submissions


def get_questions_by_selection(
        category_ids,
        sub_category_ids,
        wrong_only=False,
        user_guid=None  
          ) -> list[Question]:
    result = []
    questions = []
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
    if wrong_only and user_guid:
        submission = Submissions.objects(user_guid=user_guid).first()
        if submission:
            wrong_question_ids = {attempt.question.id for attempt in submission.attempts if not attempt.is_correct}
            questions = [q for q in questions if q.id in wrong_question_ids]
        else:
            questions = []
    return list(questions)