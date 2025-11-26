from django.urls import path
from .views import export_database_view, export_collections_list_view

urlpatterns = [
    path('export/', export_database_view, name='export_database'),
    path('collections/', export_collections_list_view, name='collections_list'),
]