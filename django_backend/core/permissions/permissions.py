# December 10, Samip Regmi

from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):        
        if not request.user.is_authenticated or not hasattr(request.user, 'user_roles'):
            return False
        # A USER CAN HAVE MULTIPLE ROLES
        return request.user.user_roles.filter(role__name='ADMIN').exists()


class IsContributor(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated or not hasattr(request.user, 'user_roles'):
            return False
        return request.user.user_roles.filter(role__name='CONTRIBUTOR').exists()
    

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
    

class AllowAny(BasePermission):
    def has_permission(self, request, view):
        return True