from mongo.models import Question, Category, SubCategory

# found an alternative which is better than below code
# we can use aggregation of mongo

def get_heirarchy() -> tuple[int, list]: 
    categories = Category.objects.all()
    total_questions = Question.objects.count()
    category_list = []
    for category in categories:
        subcategories = SubCategory.objects.filter(category=category)
        subcategory_list = []
        category_question_count = 0

        for subcategory in subcategories:
            question_count = Question.objects.filter(sub_categories=subcategory).count()
            category_question_count += question_count
            subcategory_list.append({
                "id": str(subcategory.id),
                "name": subcategory.name,
                "question_count": question_count
            })

        category_list.append({
            "id": str(category.id),
            "name": category.name,
            "question_count": category_question_count,
            "sub_categories": subcategory_list
        })
    hierarchy = {
        'total_questions':total_questions,
        'categories':category_list
    }
    return hierarchy