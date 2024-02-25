from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.contrib import messages
from .models import Post
from .forms import CommentForm

# Create your views here.

class PostList(generic.ListView):
     queryset = Post.objects.filter(status=1)
     template_name = "blog/blog.html"
     paginate_by = 6


def comment_content(request, slug):
    """
    Display an individual :model:`blog.Post`.

    **Context**

    ``post``
        An instance of :model:`blog.Post`.

    **Template:**

    :template:`blog/blog.html`
    """

    queryset = Post.objects.filter(status=1)
    post_content = get_object_or_404(queryset, slug=slug)
    comments = post_content.comments.all().order_by("-created_on")
    comment_count = post_content.comments.filter(approved=True).count()
    comment_form = CommentForm()
    if request.method == "POST":
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
          comment = comment_form.save(commit=False)
          comment.author = request.user
          comment.post = post_content
          comment.active = True
          comment.save()
          messages.add_message(
               request, messages.SUCCESS,
               'Comment submitted and awaiting approval'
          )
    

    return render(
        request,
        "blog/blog.html",
        {
             "post": post_content,
             "comments": comments,
             "comment_count": comment_count,
             "comment_form": comment_form,
        }
     )