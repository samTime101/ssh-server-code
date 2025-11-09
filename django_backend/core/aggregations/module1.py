# AGGREGATION FOR HIERARCHY (module1-module6)

# AGGRAGATION IS ON -> SubCategory Model
# join question document to subcategory document, match by question subcategoryid

# Join list of all questions to current document


# Subcategory document will have a new field "questions" 
# which is a list of all questions related to that subcategory
join_question_document = {
    "$lookup": {
        "from": "questions",
        "localField": "_id",
        "foreignField": "sub_categories",
        "as": "questions"
    }
}