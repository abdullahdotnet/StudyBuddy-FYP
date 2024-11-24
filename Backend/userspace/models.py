from django.db import models
# from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

# class UserManager(BaseUserManager):
#     def create_user(self, email, name, classlevel, password=None, password2=None):
#         """
#         Creates and saves a User with the given email, name, classlevel and password.
#         """
#         if not email:
#             raise ValueError('User must have an email address')

#         user = self.model(
#             email=self.normalize_email(email),
#             name=name,
#             classlevel=classlevel,
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user

class FilesLink(models.Model):
    user_id = models.IntegerField()  # Default value for user_id
    file_path = models.CharField(max_length=255)  # Default file path
    file_name = models.CharField(max_length=255, default="filename")  # Default file name

    def __str__(self):
        return f"User {self.user_id} - {self.file_path}"
