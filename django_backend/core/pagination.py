# Samip Regmi
# Paginition file
# Custom Pagination
# Overridden existing Pagination method 
# Added current_page, total_pages
# Default pagination under PageNumberPagination

from rest_framework.pagination import PageNumberPagination
import math

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        # response = super().get_paginated_response(data)            
        response = super().get_paginated_response(data)            
        total_pages = math.ceil(self.page.paginator.count / self.page.paginator.per_page)
        response.data['total_pages'] = total_pages
        response.data['current_page'] = self.page.number
        return response
    
    def get_paginated_response_schema(self, schema):
        response_schema = super().get_paginated_response_schema(schema)
        response_schema['properties']['current_page'] = {'type': 'integer','example': 3,}
        response_schema['properties']['total_pages'] =  {'type': 'integer','example': 13,}
        return response_schema


class QuestionResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)            
        total_pages = math.ceil(self.page.paginator.count / self.page.paginator.per_page)
        response.data['total_pages'] = total_pages
        response.data['current_page'] = self.page.number
        return response
    
    def get_paginated_response_schema(self, schema):
        response_schema = super().get_paginated_response_schema(schema)
        response_schema['properties']['current_page'] = {'type': 'integer','example': 3,}
        response_schema['properties']['total_pages'] =  {'type': 'integer','example': 13,}
        return response_schema