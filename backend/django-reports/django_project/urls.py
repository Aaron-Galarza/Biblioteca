# django-reports/django_project/urls.py

from django.urls import path, include

urlpatterns = [
    # Cuando Cloud Run reciba una solicitud, la enviaremos a la app 'reports'
    path('', include('reports.urls')), 
]