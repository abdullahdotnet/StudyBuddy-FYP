from django.shortcuts import render

# Create your views here.
# myapp/views.py

from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, this is my app!")
