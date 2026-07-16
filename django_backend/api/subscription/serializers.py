from rest_framework import serializers
from sql.models import Subscription, SubscriptionOrder


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"
        read_only_fields = ("id",)

class SubscriptionOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionOrder
        fields = "__all__"
        read_only_fields = ("id","user","status","created_at","updated_at",)
