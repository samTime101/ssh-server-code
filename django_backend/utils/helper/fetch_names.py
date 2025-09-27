from django.core.exceptions import ObjectDoesNotExist

def fetch_names(model, ids, id_field, name_field):
    # IF id_field IS 'categoryId'THEN query = model.objects.filter(categoryId__in=ids)
    if not ids:
        return []
    query = model.objects.filter(**{f"{id_field}__in": ids})
    name_list = list(query.values_list(name_field, flat=True))
    if len(name_list) != len(ids):
        existing_ids = set(query.values_list(id_field, flat=True))
        missing_ids = set(ids) - existing_ids
        raise ObjectDoesNotExist(f"IDs {missing_ids} do not exist in {model.__name__}.")
    return name_list