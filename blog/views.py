from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.contrib import messages
from django.db.models import Count, Q
from django.views.generic.detail import DetailView
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

     def get_queryset(self):
         """
         Overrides the default queryset to filter posts by status, annotate each post with
         the count of approved comments, and order the posts by their creation date in descending order.
         """
         return Post.objects.filter(status=1).annotate(
             approved_comments_count=Count('comments', filter=Q(comments__approved=True))
         ).order_by('-created_on')
     
     def get_context_data(self, **kwargs):
         """
         Extends the base implementation to add the list of posts to the context.
         """
         context = super().get_context_data(**kwargs)
         queryset = self.get_queryset()
         posts = list(queryset)
         context['posts'] = posts
         return context
     

class PostDetail(DetailView):
    """
    A view that inherits from Django's DetailView for displaying a single post detail.
    It includes comments and a form for adding new comments.
    """
    model = Post
    template_name = "blog/blog.html"

    def get_context_data(self, **kwargs):
         """
         Overrides to add comments, comment form, and comment count to the context for the post.
         """
         context = super().get_context_data(**kwargs)
         post = context['post']
         comments = post.comments.filter(approved=True).order_by('-created_on')
         context['comments'] = comments
         context['comment_form'] = CommentForm()
         context['comment_count'] = comments.count()
         return context
    


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