from django.db import models
from account.models import User


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
