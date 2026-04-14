# December 10,2025

from mongo.models import Question, Submissions

def wrong_only_questions(questions: list[Question], user_guid: str) -> list[Question]:
    # sabai user ko submission liney
    # question id sanga compare question ra is_correct false hunuparo, tei questions lai returng garne
    submissions = Submissions.objects(user_guid=user_guid)
    wrong_question_ids = set()
    for submission in submissions:
        wrong_question_ids.update(attempt.question.id for attempt in submission.attempts if attempt.question and not attempt.is_correct)
    if wrong_question_ids:
        questions = [q for q in questions if q.id in wrong_question_ids]
    else:
        questions = []
    return list(questions)

def non_attempted_questions(questions: list[Question], user_guid: str) -> list[Question]:
    # non attempted questions haru return garne, question haru which are not in attempted_questions.id
    submissions = Submissions.objects(user_guid=user_guid)
    attempted_question_ids = set()
    for submission in submissions:
        attempted_question_ids.update(attempt.question.id for attempt in submission.attempts if attempt.question)
    if attempted_question_ids:
        questions = [q for q in questions if q.id not in attempted_question_ids]
    return list(questions)