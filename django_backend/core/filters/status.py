from core.constants.status import QUESTION_STATUSES

def filter_status(queryset, request):
    status_param = request.query_params.get("status", None)
    if status_param is not None:
        status_param = status_param.lower()
    if status_param in QUESTION_STATUSES:
        return queryset.filter(status=status_param)
    else:
        return queryset