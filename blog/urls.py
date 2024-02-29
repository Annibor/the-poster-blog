from . import views
from django.urls import path

urlpatterns = [
    path('', views.PostList.as_view(), name='blog'),
    path('<slug:slug>/', views.comment_content, name='comment_content'),
]