
## API RESPONSE(THIS ROUTE REQUIRES AUTHENTICATION TOKEN)

> [!TIP]
>  U HAVE TO BE SUPERUSER TO CREATE QUESTION 

`API ENDPOINT:/api/create/question/`

`
Authorization Bearer:<access_token>
`

## REQUEST FOR POST WITH ACCESS CORRECT TOKEN PROVIDED IN HEADER REQUEST

**if you dont give description then description will be `null`**

```json
{
  "questionData": {
    "questionText": "what is aaaa?",
    "questionType": "multiple",
    "options": [
      { "optionId": "A", "text": "for" },
      { "optionId": "B", "text": "while" },
      { "optionId": "C", "text": "switch" },
      { "optionId": "D", "text": "do-while" }
    ],
    "correctAnswers": ["A", "B", "D"],
    "difficulty": "easy",
    "categoryId": 1,
    "subCategoryId": [2],
    "subSubCategoryId": [1],
    "description": "some explanation here"
  }
}

```

## RESPONSE (201)

```json
{
	"message": "Question created successfully",
	"question": {
		"id": "68cd67e1ae8bf652ceb6ca81",
		"questionText": "what is aaaa?",
		"description": "some explanation here",
		"questionType": "multiple",
		"options": [
			{
				"optionId": "A",
				"text": "for"
			},
			{
				"optionId": "B",
				"text": "while"
			},
			{
				"optionId": "C",
				"text": "switch"
			},
			{
				"optionId": "D",
				"text": "do-while"
			}
		],
		"correctAnswers": [
			"A",
			"B",
			"D"
		],
		"difficulty": "easy",
		"category": "Computer Science",
		"subCategory": [
			"Programming"
		],
		"subSubCategory": [],
		"createdAt": "2025-09-19T14:25:37.943105",
		"updatedAt": "2025-09-19T14:25:37.943126"
	}
}
```