# final return format, for categories 
final_projection = {
    "$project": {
        "_id": 0,
        "id": {"$toString": "$category_info._id"},
        "name": "$category_info.name",
        "question_count": "$category_question_count",
        "sub_categories": 1
    }
}