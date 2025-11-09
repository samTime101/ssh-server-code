# group by category and combine subcategory into list

# see Category and append list of subcategories

# this will create a new document for each category, each document will have a list of subcategories
group_by_category = {
    "$group": {
        "_id": "$category",  
        "sub_categories": {
            "$push": {
                "id": {"$toString": "$_id"},
                "name": "$name",
                "question_count": "$sub_category_question_count"
            }
        },
        "category_question_count": {"$sum": "$sub_category_question_count"} # yo naya field ho
    }
}

# joinining category details to this new document 
join_category_document = {
    "$lookup": {
        "from": "categories",
        "localField": "_id",
        "foreignField": "_id",
        "as": "category_info"
    }
}