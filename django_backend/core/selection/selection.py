# Nov 2
# Samip Regmi
# Selection file
# Endpoint /api/question/select_questions

from mongo.models import Question
from core.selection.questions import selected_questions
from core.selection.extras import wrong_only_questions, non_attempted_questions


def get_questions_by_selection(
        category_ids,
        sub_category_ids,
        wrong_only=False,
        user_guid=None,
        non_attempted=True,
        ) -> list[Question]:
    
    questions = selected_questions(category_ids=category_ids,sub_category_ids=sub_category_ids,)

    # FIND ALL NON-ATTEMPTED QUESTIONS
    if non_attempted and user_guid:
        questions = non_attempted_questions(questions, user_guid)
    # FIND ALL WRONG QUESTIONS
    
    if wrong_only and user_guid:
        questions = wrong_only_questions(questions, user_guid)

    return list(questions)
