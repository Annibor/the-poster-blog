from . import views
from .views import PostList, PostDetail, CommentCreate
from django.urls import path

app_name = 'blog'

urlpatterns = [
    path('', PostList.as_view(), name='blog'),
    path('post/<slug:slug>/', PostDetail.as_view(), name='post_detail'),
    path('post/<slug:slug>/comment/', CommentCreate.as_view(), name='comment_create'),
]
