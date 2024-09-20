from django.db import models


class ImageData(models.Model):
    image = models.ImageField(upload_to='images/')
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField()

    class Meta:
        verbose_name_plural = 'ImageData'

    def __str__(self):
        return self.description if self.description else 'No description'
