
## API RESPONSE(THIS ROUTE REQUIRES AUTHENTICATION TOKEN)


`API ENDPOINT:/api/select/questions/`

`
Authorization Bearer:<access_token>
`

## REQUEST FOR POST WITH ACCESS CORRECT TOKEN PROVIDED IN HEADER REQUEST
```json
{
    "categoryIds": [2],
    "subCategoryIds": [],
    "subSubCategoryIds":[]
}

```

## RESPONSE (201)

```json
{
    "questions": [
        {
            "id": "68a98ac5d969b82fb73726a2",
            "questionText": "what is the way to multiply two matrices",
            "questionType": "single",
            "description": "whats upp",
            "options": [
                {
                    "optionId": "A",
                    "text": "a"
                },
                {
                    "optionId": "B",
                    "text": "b"
                },
                {
                    "optionId": "C",
                    "text": "c"
                },
                {
                    "optionId": "D",
                    "text": "d"
                }
            ],
            "correctAnswers": [],
            "difficulty": "easy",
            "category": "Maths",
            "subCategory": [
                "Matrices"
            ],
            "subSubCategory": [
                "Matrices"
            ],
            "createdAt": "2025-08-23T09:32:53.640000",
            "updatedAt": "2025-08-23T09:32:53.640000"
        }
    ]
}
```