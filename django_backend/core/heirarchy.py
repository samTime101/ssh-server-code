from core.constants.status import APPROVED_STATUS
from mongo.models import Question, Category, SubCategory, Submissions

# found an alternative which is better than below code
# we can use aggregation of mongo

def get_heirarchy(user_guid: str | None = None) -> dict:
    categories = Category.objects.all()
    total_questions = Question.objects(status=APPROVED_STATUS).count()
    category_list = []

    # Load all submissions for a user so attempted counts are session-aware.
    submissions = []
    attempted_map = {}  # mapping subcategory_id -> set of attempted question ids
    if user_guid:
        submissions = Submissions.objects(user_guid=user_guid)
        for submission in submissions:
            for attempt in submission.attempts:
                try:
                    q = attempt.question
                    if not q or q.status != APPROVED_STATUS:
                        continue
                    qid = str(q.id)
                    for sc in q.sub_categories:
                        sid = str(sc.id)
                        attempted_map.setdefault(sid, set()).add(qid)
                except Exception:
                    continue

    for category in categories:
        subcategories = SubCategory.objects.filter(category=category)
        subcategory_list = []
        category_question_count = 0
        category_attempted_count = 0

        for subcategory in subcategories:
            question_count = Question.objects.filter(sub_categories=subcategory, status=APPROVED_STATUS).count()
            category_question_count += question_count

            # compute attempted count for this subcategory for the user
            attempted_count = 0
            if submissions:
                attempted_count = len(attempted_map.get(str(subcategory.id), set()))
            category_attempted_count += attempted_count

            subcategory_list.append({
                "id": str(subcategory.id),
                "name": subcategory.name,
                "question_count": question_count,
                "attempted_count": attempted_count,
                "icon": subcategory.icon,
            })

        category_list.append({
            "id": str(category.id),
            "name": category.name,
            "question_count": category_question_count,
            "attempted_count": category_attempted_count,
            "sub_categories": subcategory_list,
            "icon": category.icon,
        })

    hierarchy = {
        "total_questions": total_questions,
        "categories": category_list,
    }
    return hierarchy