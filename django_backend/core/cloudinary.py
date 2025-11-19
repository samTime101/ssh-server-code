import cloudinary.uploader
import cloudinary.api

def upload_question_image(image_file, question_id):
    folder_path = f"Images/{question_id}"
    result = cloudinary.uploader.upload(
        image_file,
        folder=folder_path,
        public_id="question_image",
        overwrite=True,
        resource_type="image"
    )
    return result.get("secure_url")


def delete_question_image(question_id):
    try:
        public_id = f"Images/{question_id}/question_image"
        cloudinary.uploader.destroy(public_id)
    except cloudinary.exceptions.Error as e:
        print(f'error in cloudinary {e}')

def delete_question_folder(question_id):
    folder_path = f"Images/{question_id}"
    try:
        delete_assets_all = cloudinary.api.delete_resources_by_prefix(folder_path)
        print(f'all assets under {folder_path} deleted {delete_assets_all}')
        delete_folder = cloudinary.api.delete_folder(folder_path)
        print(f'folder{folder_path} deleted {delete_folder}')        
    except cloudinary.exceptions.Error as e:
        print(f'error in cloudinary {e}')