from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from django.utils.text import slugify


class Category(models.Model):
    """
    Represents a category for categorizing posts. Each category has a unique name and a corresponding slug.

    Attributes:
        name (CharField): The name of the category. Must be unique.
        slug (SlugField): A slugified version of the category name. It's used in URLs.
    """
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=80, unique=True, blank=True)

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to automatically generate a slug from the category name if not provided.
        """
        if not self.slug:
            self.slug = slugify(self.name)
        super(Category, self).save(*args, **kwargs)

    def __str__(self):
        """
        Returns the string representation of the Category, which is its name.
        """

        return self.name

    class Meta:
        """
        Meta options for the Category model.
        
        Attributes:
            verbose_name_plural (str): The plural name for the category. Used in the Django admin.
        """
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
  featured_image = CloudinaryField('image', default='post.title')
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


class Like (models.Model):
   """
    Represents a 'like' given to a blog post by a user.

    Attributes:
        user (ForeignKey): The user who liked the post.
        post (ForeignKey): The post that was liked.
        created_at (datetime): The date and time the like was given.
   """
   user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes")
   post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
   created_on = models.DateTimeField(auto_now_add=True)

   class Meta:
      """
      Make sure that a user can only like a post once.
      """
      unique_together = ("user", "post")

   def __str__(self):
      return f'{self.user} likes {self.post}'