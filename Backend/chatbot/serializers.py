from rest_framework import serializers


class ChatInputSerializer(serializers.Serializer):
    query = serializers.CharField()
