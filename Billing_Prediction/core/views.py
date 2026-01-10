from django.shortcuts import render

# Create your views here.

def landing(request):
    return render(request, 'core/landing.html')

def about(request):
    return render(request, 'core/about.html')
