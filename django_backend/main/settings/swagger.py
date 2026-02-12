SPECTACULAR_SETTINGS = {
    "COMPONENT_SPLIT_REQUEST": True,
    "TITLE": "MCQ API",
    "DESCRIPTION": """

## February 11, 2026
- Moved categories and subcategories fields from SubmissionsSerializer to AttemptSerializer to provide more detailed information about each attempt.    

## February 5, 2026
- Added `college` and `phonenumber` in user profile response.    
- Removed `USER` role and made it implicit for all users.
- Updated `get_roles` method in User model to return list of role names directly from the database, ensuring that "USER" is included for all users.

## January 21, 2026
- Ported image storage from cloudinary to Django's default storage system.
- Added Number change and password confirmation
- Added `confirm_password` field during password change and during signup to ensure password accuracy.


## January 17, 2026
- Added anchor link to Email Link
- added `question_text` field in AttemptSerializer to include question text in attempt details.
- added `selected_options_labels` field in AttemptSerializer to include the text of selected options in attempt details.


## December 30, 2025
- Added `is_email_verified` field in User model to track email verification status.
- Email verification is now required during user signup. Verification email is sent upon successful registration.
- Created `/api/auth/verify-email/<token>/` endpoint to handle email verification using tokens
- Added caching mechanism to store email verification tokens with a 30-minute expiry time.
- Question id bug fixed in AttemptSerializer to return string representation of ObjectId.


## December 22, 2025
- /users/profile endpoint now includes `roles` field listing all roles assigned to the user.
- added category_name field in SubCategorySerializer to include the name of the parent category.
- Fixed issue with SubCategorySerializer where category field was not being serialized correctly.


## December 12, 2025
- Custom UserManager is now used for User model to handle user creation and management.
- ``/api/questions/select/`` endpoint now supports `wrong_only` and `non_attempted` query parameters to filter questions based on user's previous attempts.
- Admin now can assign multiple roles to a user using the `/api/users/{user_guid}/assign-role/` endpoint.
- Admin can view all roles assigned to a user using the `/api/users/{user_guid}/roles/` endpoint.
- Admin can view all user-role assignments using the `/api/users/roles/` endpoint.
- Admin can also do CRUD operation on `roles` using `/api/roles/` endpoint.


## November 30, 2025
- Added `wrong_only` query parameter to `/api/questions/select/` endpoint to select only
- Added fields `contributor_speclaization` in Question model and serializers 

## November 25, 2025
- Added `question_image_unchanged` and `description_image_unchanged` fields in question endpoint to handle image updates properly.
- Seperated image upload and deletion logic for question and description images.
- Added `contributor` field in question endpoint responses.
- Added `college` in signup request body.
- Required image fileds are `question_image` and `description_image` in multipart/form-data for question creation.

## November 16, 2025
- Added `total_right_attempts`, `total_attempts`, `completion_percent` and `accuracy_percent` fields in user profile response
- Added `incorrect_answers`, `selected_answers` and `correct_answers` fields in submission response

## November 11, 2025
- Enabled `is_true` field in options for admin users in question endpoint responses
- Added `QuestionPublicSerializer` for non-admin users to hide `is_true` field
    
## November 9, 2025
- Added `category_names` and `subcategory_names` in response for question endpoint
- Reverted back to manual forloops for `hierarchy`
    
## November 8, 2025
- Replaced manual forloops for `hierarchy` with mongo's `aggregation` 
- New endpoint `/api/users/profile/` to get current user's profile details
- To remove image, add `"image_unchanged": false` in the `PUT` request body

## November 7, 2025
- Instead of overridden methods to link and unlink classification, now `signals` are used 
- When a category or subcat is deleted, all its question is deleted along with its linkage

## November 6, 2025
- Images now supported for `question` endpoint. (1 image per question)
- When requesting from API CLIENT (*Insomnia* recommended/ *Postman*) put `https://sisani-mcq-latest.onrender.com/api/<endpoint>`

## November 4, 2025
- Added `total_pages` and `current_page` fields in pagination responses.

## Information

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
   - `question_image`: The associated image file for question.
   - `description_image`: The associated image file for description
"""
}