SPECTACULAR_SETTINGS = {
    "COMPONENT_SPLIT_REQUEST": True,
    "TITLE": "MCQ API",
    "DESCRIPTION": """

## November 16, 2025
- Added `total_right_attempts`, `total_attempts`, `completion_percent` and `accuracy_percent` fields in user profile response
- Added `incorrect_answers`, `selected_answers` and `correct_answers` fields in submission response

## November 11, 2025
- Enabled `is_true` field in options for admin users in question endpoint responses
- Added `QuestionPublicSerializer` for non-admin users to hide `is_true` field
    
### November 9, 2025
- Added `category_names` and `subcategory_names` in response for question endpoint
- Reverted back to manual forloops for `hierarchy`
    
### November 8, 2025
- Replaced manual forloops for `hierarchy` with mongo's `aggregation` 
- New endpoint `/api/users/profile/` to get current user's profile details
- To remove image, add `"image_unchanged": false` in the `PUT` request body

### November 7, 2025
- Instead of overridden methods to link and unlink classification, now `signals` are used 
- When a category or subcat is deleted, all its question is deleted along with its linkage

### November 6, 2025
- Images now supported for `question` endpoint. (1 image per question)
- When requesting from API CLIENT (*Insomnia* recommended/ *Postman*) put `https://sisani-mcq-latest.onrender.com/api/<endpoint>`

### November 4, 2025
- Added `total_pages` and `current_page` fields in pagination responses.

### Information

- When creating a category or subcategory, provide their `ObjectId`.
- To select questions based on topics, include a list of `ObjectId`s for the relevant category/subcategory.
- When submitting attempts, send the question `ObjectId`s in the `question` field.

**Important Note:**

The `POST` and `PUT` endpoints under `/api/questions/` are **not accessible via Swagger UI**.

To use these endpoints:
1. Use an API client like **Insomnia**.
2. Send requests as **multipart/form-data**.
3. Include the following fields:
   - `data`: JSON string containing the question metadata.
   - `image`: The associated image file.
"""
}