from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.views.generic import UpdateView, ListView
from django.views import View
from django.views import generic
from django.contrib import messages
from django.db.models import Count, Q
from django.views.generic.detail import DetailView
from .models import Post, Like, Comment, Category
from .forms import CommentForm
import json


# Create your views here.

class PostList(generic.ListView):
     """
     A view that inherits from Django's ListView for displaying a list of posts.
     It is configured to paginate the posts, showing a limited number per page.
     """
     model = Post
     template_name = "blog/blog.html"
     context_object_name = 'post_list'
     # Limits the number of posts displayed on a single page.
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
    

class CommentCreate(View):
     """
     A view handling the creation of a new comment for a specific post. This view processes
     the POST request submitted through the comment form.
     """
     def post(self, request, slug):
        """
        Handles POST request. If the comment form is valid, saves the new comment
        and associates it with the correct post and user.
        """
        post = get_object_or_404(Post, slug=slug)
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.author = request.user
            comment.post = post
            comment.save()
            messages.success(request, 'Comment submitted and awaiting approval')
             # Redirect to the blog main page after successful comment submission.
            return redirect('blog:blog') 
        else:
            messages.error(request, 'Invalid comment.')
            # If the form is invalid, redirect back to the blog's main page
            return redirect('blog:blog')
        

class CommentUpdate(LoginRequiredMixin, View):
    """
    A view that handles updating an existing comment. This view checks if the
    user is authenticated and authorized to edit the comment before updating it.
    
    Inherits from:
    - LoginRequiredMixin: Ensures that the user is authenticated.
    - View: A basic class-based view provided by Django.
    """
    
    def post(self, request, *args, **kwargs):
        """
        Handles POST requests. It updates a comment's body with the new content provided by the user.

        Args:
            request: The HttpRequest object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            JsonResponse: A JSON response indicating the success or failure of the operation.
        """
        comment_id = self.kwargs.get('comment_id')
        comment = get_object_or_404(Comment, id=comment_id)

        # Check if the current user is the author of the comment.
        if comment.author != request.user:
            return JsonResponse({'status': 'error', 'message': 'Permission denied'}, status=403)

        # Decode the JSON data from the request body.
        data = json.loads(request.body.decode('utf-8'))
        # Extract the 'body' field from the JSON data, stripping any leading/trailing whitespace.
        body = data.get('body', '').strip()

        # Check if the body is not empty.
        if not body:
            return JsonResponse({'status': 'error', 'message': 'Comment body cannot be empty'}, status=400)

        # Update the comment's body with the new content.
        comment.body = body
        # Save the updated comment object to the database.
        comment.save()

        # Return a success response.
        return JsonResponse({'status': 'success', 'message': 'Comment updated successfully'})


class CommentDelete(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        comment_id = self.kwargs.get('comment_id')
        comment = get_object_or_404(Comment, id=comment_id)

        comment.delete()
        return JsonResponse({'status': 'success', 'message': 'Comment deleted successfully'})
        

class LikePost(LoginRequiredMixin, View):
    """
    Allows a logged-in user to like or unlike a post. If the post is already liked by the user,
    this view will remove the like (toggle action).
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST request to like or unlike a post.
        """
        slug = self.kwargs.get('slug')
        post = get_object_or_404(Post, slug=slug)
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            like.delete()

        return redirect('blog:blog')
    

class CategoryPosts(ListView):
    model = Post
    template_name = 'blog/category.html'
    context_object_name = 'posts'

    def get_queryset(self):
        """Override to filter posts by category based on slug in URL."""
        return Post.objects.filter(categories__slug=self.kwargs['slug'])

    def get_context_data(self, **kwargs):
        """Add category to context."""
        context = super().get_context_data(**kwargs)
        context['category'] = Category.objects.get(slug=self.kwargs['slug'])
        return context