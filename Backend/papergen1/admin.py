from django.contrib import admin
from .models import Subject


class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'grade')
    list_filter = ('status', 'grade')


admin.site.register(Subject, SubjectAdmin)
