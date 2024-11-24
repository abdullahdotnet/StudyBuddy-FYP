from django.db import models


class Subject(models.Model):
    GRADE_CHOICES = [
        ('9', 'Class 9'),
        ('10', 'Class 10'),
        ('11', 'Class 11'),
        ('12', 'Class 12'),
    ]

    name = models.CharField(max_length=100)
    status = models.BooleanField(default=True)
    grade = models.CharField(max_length=2, choices=GRADE_CHOICES)

    def __str__(self):
        return self.name
