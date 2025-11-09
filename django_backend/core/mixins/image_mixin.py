from core.cloudinary import upload_question_image, delete_question_image


# Image handling mixin
class ImageHandlerMixin:
    def handle_image_create(self, instance,image_file):
        # yedi file deko xa vey create image
        if image_file:
            instance.image_url = upload_question_image(image_file, instance.id)
        return instance

    def handle_image_update(self, instance, image_file, leave_unchanged=False):
        if image_file is not None:
            # yedi image file empty xaina vaney, update image
            delete_question_image(instance.id)
            instance.image_url = upload_question_image(image_file, instance.id)
        elif not leave_unchanged:
            # yedi image file empty xa ra user le unchange garne request gardaixa vane
            # delete image and set image_url:null
            delete_question_image(instance.id)
            instance.image_url = None
        return instance