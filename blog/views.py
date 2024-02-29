from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.contrib import messages
from .models import Post
from .forms import CommentForm


# Create your views here.

class PostList(generic.ListView):
     """
     A view that inherits from Django's ListView for displaying a list of posts.
     It is configured to paginate the posts, showing a limited number per page.
     """
     model = Post
     template_name = "blog/blog.html"
     context_object_name = 'post_list'
     paginate_by = 6


def comment_content(request, slug):
    """
    Display and handle comments for a blog post.
    """

    queryset = Post.objects.filter(status=1)
    post = get_object_or_404(queryset, slug=slug)
    comments = post.comments.all().order_by("-created_on")
    comment_count = post.comments.filter(approved=True).count()
    print("Comment count:", comment_count) # REmember to delte!!!
    print("Received a POST request")
    if request.method == "POST":
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
          comment = comment_form.save(commit=False)
          comment.author = request.user
          comment.post = post
          comment.active = True
          comment.save()
          messages.add_message(
               request, messages.SUCCESS,
               'Comment submitted and awaiting approval'
          )
    
    comment_form = CommentForm()
    print("About to render template")

    return render(
        request,
        "blog/blog.html",
        {
             "post": post,
             "comments": comments,
             "comment_count": comment_count,
             "comment_form": comment_form,
        }
     )