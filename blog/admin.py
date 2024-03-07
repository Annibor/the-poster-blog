from django.contrib import admin
from .models import Category, Post, Comment, Like
from django_summernote.admin import SummernoteModelAdmin


# Register your models here.

@admin.register(Post)
class PostAdmin(SummernoteModelAdmin):
    list_display = ('title', 'slug', 'status', 'created_on', 'number_of_likes')
    search_fields = ['title', 'post_content']
    list_filter = ('status', 'created_on', 'categories')
    prepopulated_fields = {'slug': ('title',)}
    summernote_fields = ('post_content',)

    def number_of_likes(self, obj):
        return obj.post_likes.count()
    number_of_likes.short_description = 'Number of Likes'


admin.site.register(Category)
admin.site.register(Comment)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'liked_on')
    search_fields = ['post__title', 'user__username']
    list_filter = ('post', 'user')

    def liked_on(self, obj):
        return obj.created_on
    liked_on.short_description = 'Liked on'
