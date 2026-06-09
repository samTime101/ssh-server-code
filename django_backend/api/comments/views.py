from rest_framework_mongoengine import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from api.comments.serializers import CommentSerializer
from mongo.models import Comment
from sql.models import User
from core.permissions.permissions import IsAuthenticated

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'
    
    def get_queryset(self):
        return Comment.objects.all()

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if str(comment.user_guid) != str(request.user.user_guid) and not request.user.has_role('admin'): # Assuming user can only delete own comments or admin
            return Response({"detail": "Not authorized to delete this comment."}, status=status.HTTP_403_FORBIDDEN)
        
        # When a comment is deleted, we might want to just obliterate it and its children.
        # But mongoengine ReferenceField('self', reverse_delete_rule=CASCADE) could handle it. We haven't set CASCADE on parent_comment.
        # So we should delete children manually if needed, or just let them be orphaned / delete manually.
        # Let's delete all children recursively.
        def delete_children(comment_id):
            children = Comment.objects.filter(parent_comment=comment_id)
            for child in children:
                delete_children(child.id)
                child.delete()
        
        delete_children(comment.id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if str(comment.user_guid) != str(request.user.user_guid):
            return Response({"detail": "Not authorized to edit this comment."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='tree')
    def tree(self, request):
        question_id = request.query_params.get('question_id')
        if not question_id:
            return Response({"detail": "question_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        comments_qs = Comment.objects.filter(question=question_id)
        
        user_guids = list({str(c.user_guid) for c in comments_qs})
        users = User.objects.filter(user_guid__in=user_guids)
        user_map = {str(u.user_guid): {"username": u.username, "first_name": u.first_name, "last_name": u.last_name} for u in users}
        
        current_user_guid = str(request.user.user_guid)

        comments_dict = {}
        for comment in comments_qs:
            comments_dict[str(comment.id)] = {
                "id": str(comment.id),
                "text": comment.text,
                "user_guid": str(comment.user_guid),
                "user": user_map.get(str(comment.user_guid), {"username": "Unknown", "first_name": "Unknown", "last_name": ""}),
                "parent_comment": str(comment.parent_comment.id) if comment.parent_comment else None,
                "created_at": comment.created_at,
                "updated_at": comment.updated_at,
                "is_owner": str(comment.user_guid) == current_user_guid,
                "replies": []
            }
            
        tree = []
        for comment_id, comment_data in comments_dict.items():
            parent_id = comment_data["parent_comment"]
            if parent_id and parent_id in comments_dict:
                comments_dict[parent_id]["replies"].append(comment_data)
            else:
                tree.append(comment_data)
        
        def sort_replies(nodes):
            nodes.sort(key=lambda x: x["created_at"], reverse=True)
            for node in nodes:
                sort_replies(node["replies"])
                
        sort_replies(tree)
        return Response(tree)