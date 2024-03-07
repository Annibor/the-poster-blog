document.addEventListener("DOMContentLoaded", function() {
    /* -- Select all edit buttons, the comment text area, the form, and the submit button -- */
    const editButtons = document.querySelectorAll(".edit-comment-btn"); 
    const commentText = document.querySelector("#bodyField"); 
    const commentForm = document.querySelector("#commentForm"); 
    const submitButton = document.querySelector("#submitButton");
    const newCommentButton = document.querySelector("#newCommentButton");


    if (newCommentButton) {
        newCommentButton.addEventListener("click", function() {
            submitButton.innerText = "Submit";
            commentText.value = '';
            const postSlug = commentForm.getAttribute("data-post-slug");
            commentForm.setAttribute("action", `/blog/post/${postSlug}/comment/`);;
        });
    }

    /* --  Loop through all edit buttons and add a click event listener to each -- */
    editButtons.forEach(button => {
        button.addEventListener("click", function() {
            /* -- Retrieve data-comment-id attribute, which stores the ID 
            of the comment to edit. Get the post slug from the form's data-post-slug attribute.
            Find the comment's current text by its ID and get the text content   -- */
            const commentId = this.getAttribute("data-comment-id");
            const postSlug = commentForm.getAttribute("data-post-slug");
            const commentContent = document.querySelector(`#comment${commentId}`).innerText;
            
            // Debugging logs ********************************
            console.log(`Editing comment ID: ${commentId}`);
            console.log(`Post Slug: ${postSlug}`);
            console.log(`Current comment content: ${commentContent}`);
            console.log(`Form action set to: ${commentForm.getAttribute("action")}`);

            /* -- Set the comment form fields to the current comment content.
            Change the submit button text to "Update". 
            Update the form's action attribute to the correct endpoint for comment updates -- */
            commentText.value = commentContent;
            submitButton.innerText = "Update";
            commentForm.setAttribute("action", `/blog/post/${postSlug}/comment/${commentId}/`);

            console.log(`Form action set to: ${commentForm.getAttribute("action")}`);
        });
    });

    /* -- Add an event listener for the form submission -- */
    commentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        let formData = new FormData(this); 
        const actionUrl = this.getAttribute("action");

        console.log("Form submission intercepted.");

        
        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {'X-CSRFToken': formData.get('csrfmiddlewaretoken')},
        })
        .then(response => {
            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        })
        .then(data => {
            alert('Comment updated successfully');
            window.location.reload(); // Reload the page to see the updated comment list
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating comment');
        });
    });   
});