from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet, SubscriptionOrderViewSet

router = DefaultRouter()
router.register(r"subscriptions", SubscriptionViewSet, basename="subscription")
router.register(r"subscription-orders", SubscriptionOrderViewSet, basename="subscription-orders")

urlpatterns = router.urls