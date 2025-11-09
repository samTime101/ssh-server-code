# after count , remove questions
# questions vanne field jun add vako thyo from module1 will now be removed only leaving question_count
remove_questions_array = {
    "$project": {
        "questions": 0
    }
}