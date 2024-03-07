from . import views
from .views import PostList, PostDetail, CommentCreate, LikePost
from django.urls import path
from .views import CommentUpdate

app_name = 'blog'

urlpatterns = [
    path('', PostList.as_view(), name='blog'),
    path('post/<slug:slug>/', PostDetail.as_view(), name='post_detail'),
    path('post/<slug:slug>/comment/', CommentCreate.as_view(), name='comment_create'),
    path('post/<slug:slug>/like/', LikePost.as_view(), name='like_post'),
    path('post/<slug:slug>/comment/<int:comment_id/', CommentUpdate.as_view(), name='comment_update'),
]
