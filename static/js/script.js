document.addEventListener("DOMContentLoaded", function() {
    const editButtons = document.querySelectorAll(".edit-comment-btn"); 
    const commentText = document.querySelector("#bodyField"); 
    const commentForm = document.querySelector("#commentForm"); 
    const submitButton = document.querySelector("#submitButton");



    editButtons.forEach(button => {
        button.addEventListener("click", function() {
            const commentId = this.getAttribute("data-comment-id");
            const postSlug = commentForm.getAttribute("data-post-slug");
            const commentContent = document.querySelector(`#comment${commentId}`).innerText;
            
            // Debugging logs
            console.log(`Editing comment ID: ${commentId}`);
            console.log(`Post Slug: ${postSlug}`);
            console.log(`Current comment content: ${commentContent}`);
            console.log(`Form action set to: ${commentForm.getAttribute("action")}`);

            commentText.value = commentContent;
            submitButton.innerText = "Update";
            commentForm.setAttribute("action", `/blog/post/${commentId}/update/`);
        });
    });


    if (commentForm) {
        commentForm.onsubmit = function(e) {
            e.preventDefault();
            // Debugging
            console.log("Form submission intercepted");

            // Prepare form data for AJAX submission
            let formData = new FormData(this); 
            const actionUrl = this.getAttribute("action");
            // Debugging
            console.log(`Form action URL: ${actionUrl}`); 

            fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Debugging
                console.log("Success:", data); 
                alert('Comment updated successfully');
            })
            .catch(error => {
                // Debugging
                console.error('Error:', error);
                alert('Error updating comment');
            });
        };
    }       
});