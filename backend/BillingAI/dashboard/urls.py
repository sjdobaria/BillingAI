from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_view, name='predict'),
    path('predictions/', views.prediction_history_view, name='prediction-history'),
]
