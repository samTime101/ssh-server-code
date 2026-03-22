def filter_status(queryset, request):
    status_param = request.query_params.get("status", None)
    if status_param is not None:
        status_param = status_param.lower()
    valid_statuses = {"approved", "pending", "rejected"}
    if status_param in valid_statuses:
        return queryset.filter(status=status_param)
    else:
        return queryset