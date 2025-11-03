# Question creation example with example data for API documentation

class CreateQuestionRequestExample:
    example = {
        "questionText": "What is the capital of France?",
        "description": "Choose the correct capital city from the options below.",
        "questionType": "single",
        "options": [
            {"optionId": "A", "text": "Berlin"},
            {"optionId": "B", "text": "Madrid"},
            {"optionId": "C", "text": "Paris"},
            {"optionId": "D", "text": "Rome"}
        ],
        "correctAnswers": ["C"],
        "difficulty": "easy",
        "categoryIds": [1],
        "subCategoryIds": [],
        "subSubCategoryIds": []
    }
    summary = "Example request to create a question"
    name = "Example Create Question Request"