# question count for subcategory
add_question_count_field = {
    "$addFields": {
        "sub_category_question_count": {"$size": "$questions"}
    }
}