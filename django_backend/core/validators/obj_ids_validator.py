from bson import ObjectId
from rest_framework import serializers

def validate_object_ids(value, model, field_name="id",allow_empty=True):
    # 1-> if not valid obj id (err)
    # 2 -> get all existing sub_cat_id 
    # 3 -> wrap in set(existing sub_cat_id)
    # 4 -> sub with provided id
    # 5 -> result is id which donot exist in db
    if not value:
        if allow_empty:
            return []
        else:
            raise serializers.ValidationError(f"At least one {field_name}  is required")
    try:
        object_ids = [ObjectId(id_str) for id_str in value]
    except Exception:
        raise serializers.ValidationError(f"Invalid ObjectId format in {field_name}")
    
    existing_ids = set(model.objects(id__in=object_ids).values_list('id'))
    provided_ids = set(object_ids)
    invalid_ids = provided_ids - existing_ids
    if invalid_ids:
        raise serializers.ValidationError(f"Invalid {field_name}: {[str(i) for i in invalid_ids]}")
    return object_ids
