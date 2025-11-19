from bson import ObjectId
from rest_framework import serializers

# sururama check garne if the payload id is valid object id
# if yes -> check in db if it exists
def validate_object_id(value, model, field_name="id"):
    try:
        obj_id = ObjectId(value)
    except Exception:
        raise serializers.ValidationError(f"Invalid ObjectId format for {field_name}")
    obj = model.objects(id=obj_id).first()
    if not obj:
        raise serializers.ValidationError(f"{field_name} with the given {value} does not exist.")
    return obj