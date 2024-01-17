from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse


def index(request):
    return render(request, "tool-zh.html")


def test(request):
    return render(request, "tooltest.html")
