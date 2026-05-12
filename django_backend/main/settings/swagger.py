SPECTACULAR_SETTINGS = {
    "COMPONENT_SPLIT_REQUEST": True,
    "TITLE": "MCQ API",
    "DESCRIPTION": """

## May 9, 2026 Ishan Upadhyay
- Added bulk CSV upload endpoint for question creation, including serializer and view wiring.
- Refactored CSV upload handling, moved validation into the parser, and introduced constants for CSV validation.
- Moved CSV-related hardcoded values into `core.constants.csv` for clearer reuse.
- Enabled attempting bookmarked questions with session handling in the Bookmarks page.

## April 13, 2026
- Added Constraint model to define rules for question selection based on categories and subcategories for set.


## April 10, 2026
- Seperated and defined constants for statues in `core.constants.status` to ensure consistency and maintainability across the codebase. Updated all relevant models, serializers, and views to utilize these constants for status fields, improving code readability and reducing the likelihood of errors due to typos or inconsistent status values.
- Unlinked Questions from set when question status is changed from approved to pending or rejected.


## March 30, 2026
- Refactored submissions now allows users to create multiple submissions and each submission can have its own set of selected questions and attempts. This allows for better tracking of user progress and performance across different sets of questions.
- User will get `submission_id` when they select question `/api/questions/select/`, and their attempt will be stored under that submission. They can have multiple active submissions at a time, but each attempt will be linked to a specific submission.
- User will also get `submission_id` when they retrieve a set ``/api/sets/<set_id>/``. This allows them to track their attempts and progress for that specific set of questions.
    
## March 28, 2026
- Added `QuestionSet` model to allow grouping of questions into sets. Each set can have a name, description, and a list of questions.
- Created serializers and viewsets for `QuestionSet` to handle CRUD operations. Admin users can create, update, and delete question sets, while non-admin users can only view them.
    

## March 20, 2026
- Added `status` to question and classifications
- Added `status` query parameter to filter questions and classifications based on their status (approved, pending, rejected). Admin users can view all statuses, while non-admin users can only view approved items.
- Updated `get_queryset` methods in `QuestionViewSet` and `QuestionClassificationViewSet` to utilize the new `status` filtering logic, ensuring that the appropriate items are returned based on the user's permissions and the specified status filter.
- if no query param is sent, all questions and classifications are returned (including pending and rejected)
- if `status` query param is sent with valid value, questions and classifications are filtered based on that status
- For subcategories, to filter based on category status, `category_status` query parameter can be used. If sent with valid value, subcategories are filtered based on the status of their parent category.


## March 14, 2026
- Added `Bookmark` model and `Bookmarks` model to handle question bookmarking functionality. Users can now bookmark questions using the `/api/questions/{id}/bookmark/` endpoint, and the bookmarks are stored in the database with a reference to the user and the question.
- Updated the `QuestionViewSet` to include a new action for bookmarking questions. This action allows authenticated users to bookmark a question by sending a POST request to the specified endpoint.
- Added a DELETE method to the bookmark action to allow users to remove bookmarks from questions.


## March 9, 2026
- Restructured the UserManager to another file called `managers/user_manager.py` to improve code organization and maintainability. Updated the User model to use the new UserManager for user creation and management operations.
    

## March 8, 2026
- Fixed email verification, created a new google account with app password and updated SMTP settings in `.env` and `emails.py` accordingly. Now email verification should work properly with the new credentials.
    

## March 1, 2026
- Rounded accuracy_percent and completion_percent to 2 decimal places in user profile response for better readability.    
- Added `ObjectId` validation for `category_id` and `sub_category_id` query parameters in question filtering to ensure valid input and prevent potential errors during filtering operations.
- Added `AllowAny` permission to `retrieve` method in `QuestionViewSet` to allow any authenticated user to access question details, not just admin users.
- Organized filtering and searching logic in `/api/questions/` endpoint by creating a separate `filters.py` file to handle all question filtering based on query parameters, improving code maintainability and readability.
- Updated `get_queryset` method in `QuestionViewSet` to utilize the new filtering function


## February 23, 2026
- Added `search` query parameter to `/api/questions/` endpoint to enable searching in `question_text` and `explanation` fields.
- Added `category_id` and `sub_category_id` query parameters to `/api/questions/` endpoint to filter questions based on category and subcategory.
- Added Pagination to `/api/questions/select/` endpoint to handle large question sets efficiently.
    

## February 18, 2026
- Admin cannot remove/add own roles.    
- Added checks in role assignment and removal serializers to ensure that the user context is provided, preventing potential errors during role management operations.
- disallowed removal of virtual USER role from any user to maintain consistent access control across the application.    

## February 17, 2026
- Fixed Queryset issue in `/api/questions/select/` endpoint to ensure correct question selection based on category and subcategory filters.    

## February 12, 2026
- Added remove-role endpoint to allow admin to remove roles from a user.    

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
- When requesting from API CLIENT (*Insomnia* recommended/ *Postman*) put `https://sisani-mcq-latest.onrender.com/api/<endpoint>` (deprecated)

## November 4, 2025
- Added `total_pages` and `current_page` fields in pagination responses.

## Information

- GET /questions/ returns all (approved, rejected,pending)
- GET /questions/?status= filters between approved, pending and rejected questions
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