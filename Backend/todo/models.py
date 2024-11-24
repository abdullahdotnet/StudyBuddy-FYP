from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=255)
    deadline = models.DateField()
    status = models.CharField(
        max_length=50,
        choices=[
            ('Completed', 'Completed'), 
            ('Pending', 'Pending'),
            ('Not Completed', 'Not Completed')
        ],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
