import csv
import json
import io
from rest_framework import serializers

class CSVUploadSerializer(serializers.Serializer):
    """Serializer for bulk uploading questions via CSV"""
    csv_file = serializers.FileField(required=True, help_text="CSV file with question data")
    
    def validate_csv_file(self, value):
        """Validate that the uploaded file is a CSV"""
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("File must be a CSV file (.csv)")
        return value
