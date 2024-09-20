from rest_framework import serializers
from .models import ImageData


class ImageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageData
        fields = ['image', 'description', 'timestamp']
