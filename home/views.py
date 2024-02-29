from django.shortcuts import render
from blog.models import Post

def starting_page(request):
    """
    Render the starting page of the site with the latest published blog post.
    
    Retrieves the most recent blog post from the database, truncates its content to the first 45 words,
    and passes both the post object and the truncated content to the 'home/index.html' template
    for rendering on the starting page.
    """
  
    latest_post = Post.objects.filter(status=1).order_by('-created_on').first()

    # Initialize context with no latest post content
    latest_post_content = ""
    
    # Truncate the post content to the first 45 words if a post is available
    if latest_post:
        latest_post_content = ' '.join(latest_post.post_content.split()[:45]) + '...'

    # Prepare the context with the latest post and truncated content
    context = {
        'latest_post': latest_post,
        'latest_post_content': latest_post_content,
    }

    return render(request, 'home/index.html', context)
