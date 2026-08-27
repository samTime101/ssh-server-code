from rest_framework import serializers
from sql.models import Client
from core.services.provisioner import provision_tenant_databases

class ClientSerializer(serializers.ModelSerializer):
    pan_photo = serializers.ImageField(source='pan_photo_url', write_only=True, required=True)
    registration_photo = serializers.ImageField(source='registration_photo_url', write_only=True, required=True)
    subdomain = serializers.CharField(required=True)
    database_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mongo_database_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Client
        fields = [
            "id", "organization_name", "address", "pan", "registration_number",
            "pan_photo", "pan_photo_url", 
            "registration_photo", "registration_photo_url",
            "phonenumber", "email", "subdomain", "database_name", "mongo_database_name", "status", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "pan_photo_url", "registration_photo_url", "status"]

    def validate(self, attrs):
        attrs = super().validate(attrs)
        
        subdomain = attrs.get('subdomain')
        if subdomain is None and self.instance:
            subdomain = self.instance.subdomain
            
        custom_sql_db = attrs.get('database_name')
        if custom_sql_db is None and self.instance:
            custom_sql_db = self.instance.database_name
            
        custom_mongo_db = attrs.get('mongo_database_name')
        if custom_mongo_db is None and self.instance:
            custom_mongo_db = self.instance.mongo_database_name

        import re
        def sanitize_name(name):
            return re.sub(r'[^a-zA-Z0-9_]', '', name)

        if subdomain:
            subdomain_qs = Client.objects.filter(subdomain=subdomain)
            if self.instance:
                subdomain_qs = subdomain_qs.exclude(pk=self.instance.pk)
            if subdomain_qs.exists():
                raise serializers.ValidationError({"subdomain": "A client with this subdomain already exists."})

            subdomain_clean = sanitize_name(subdomain)
            sql_db_name = custom_sql_db or f"sisani_tenant_{subdomain_clean}"
            sql_db_name = sanitize_name(sql_db_name)
            
            sql_qs = Client.objects.filter(database_name=sql_db_name)
            if self.instance:
                sql_qs = sql_qs.exclude(pk=self.instance.pk)
            if sql_qs.exists():
                raise serializers.ValidationError({
                    "database_name": f"A client with SQL database name '{sql_db_name}' already exists."
                })

            mongo_db_name = custom_mongo_db or f"sisani_mongo_{subdomain_clean}"
            mongo_db_name = sanitize_name(mongo_db_name)
            
            mongo_qs = Client.objects.filter(mongo_database_name=mongo_db_name)
            if self.instance:
                mongo_qs = mongo_qs.exclude(pk=self.instance.pk)
            if mongo_qs.exists():
                raise serializers.ValidationError({
                    "mongo_database_name": f"A client with MongoDB database name '{mongo_db_name}' already exists."
                })

        return attrs

    def create(self, validated_data):
        pan_photo = validated_data.pop('pan_photo_url', None)
        registration_photo = validated_data.pop('registration_photo_url', None)
        custom_sql_db = validated_data.pop('database_name', None)
        custom_mongo_db = validated_data.pop('mongo_database_name', None)

        validated_data['status'] = 'PROVISIONING'
        client = super().create(validated_data)

        if pan_photo:
            client.pan_photo_url = pan_photo
        if registration_photo:
            client.registration_photo_url = registration_photo
        client.save()

        try:
            provision_tenant_databases(
                client,
                custom_sql_db=custom_sql_db,
                custom_mongo_db=custom_mongo_db
            )
        except Exception as e:
            client.delete()
            raise serializers.ValidationError({"detail": f"Database provisioning failed: {str(e)}"})

        return client

    def update(self, instance, validated_data):
        new_pan_photo = validated_data.get('pan_photo_url')
        new_registration_photo = validated_data.get('registration_photo_url')
        if new_pan_photo and instance.pan_photo_url:
            instance.pan_photo_url.delete(save=False)
        if new_registration_photo and instance.registration_photo_url:
            instance.registration_photo_url.delete(save=False)
        return super().update(instance, validated_data)
