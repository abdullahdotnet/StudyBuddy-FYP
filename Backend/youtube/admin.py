from django.contrib import admin
from .models import ImageData


class ImageDataAdmin(admin.ModelAdmin):
    list_display = ['id', 'timestamp', 'image', 'description']

    class Meta:
        verbose_name_plural = 'ImageData'


admin.site.register(ImageData, ImageDataAdmin)
