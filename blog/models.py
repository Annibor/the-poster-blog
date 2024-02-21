from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
   """
      A model representing a category for organizing blog posts.

    Attributes:
        name: The name of the category.
    """
   name = models.CharField(max_length=40)

   class Meta:
        verbose_name_plural = "categories"
        
STATUS = (
    (0,"Draft"),
    (1,"Publish")
)


class Post(models.Model):
  """
    This model represents a post.

    Attributes:
    title: The title of the post.
    slug: The slug of the post.
    post_content: The content of the post.
    created_on: The date and time when the post was created.
    last_modifed: The last time the post was updated or changed.
    categoris: The categoris associated with the post.
    """
  title = models.CharField(max_length=250, unique=True)
  slug = models.SlugField(max_length=250, unique=True)
  post_content = models.TextField()
  created_on = models.DateTimeField(auto_now_add=True)
  last_modified = models.DateTimeField(auto_now=True)
  categories = models.ManyToManyField("Category", related_name="posts")
  status = models.IntegerField(choices=STATUS, default=0)

  def __str__(self):
    return self.title

  class Meta:
    """
    Blog Meta Data
    """
    ordering = ["-created_on"]
    verbose_name_plural = "Posts"


  def __str__(self):
       return f"{self.title}"
  

class Comment(models.Model):
  """
  This model represents a comment.

  Attributes:
  post: The post the comment is associated with.
  author: The author of the comment - the registered user.
  body: The content of the comment.
  approved: Indicates whether the comment was approved or not.
  created_on: The date and time when the comment was created.
  active: A boolean value indicating whether the comment is active.
  """
  post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="comments")
  author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="commenter"
        )
  body = models.TextField()
  approved = models.BooleanField(default=False)
  created_on = models.DateTimeField(auto_now_add=True)
  active = models.BooleanField(default=False)

  class Meta:
    """
    Comment Meta Data
    """
    ordering = ["-created_on"]

  def __str__(self):
    return f"Comment {self.body} by {self.author}"
