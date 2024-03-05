document.addEventListener("DOMContentLoaded", function() {
    /* -- Select all edit buttons, the comment text area, the form, and the submit button -- */
    const editButtons = document.querySelectorAll(".edit-comment-btn"); 
    const commentText = document.querySelector("#bodyField"); 
    const commentForm = document.querySelector("#commentForm"); 
    const submitButton = document.querySelector("#submitButton");


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
            commentForm.setAttribute("action", `/blog/post/${postSlug}/comment/${commentId}/update/`);
        });
    });

    /* -- Add an event listener for the form submission -- */
    if (commentForm) {
        commentForm.onsubmit = function(e) {
            /* -- Prevent the default form submission behavior -- */
            e.preventDefault();
            // Debugging *****************************
            console.log("Form submission intercepted");

            /* -- Prepare form data for AJAX submission -- */
            let formData = new FormData(this); 
            const actionUrl = this.getAttribute("action");
            // Debugging ***************
            console.log(`Form action URL: ${actionUrl}`); 

            /* -- Perform the fetch request to submit the form data to the server -- */
            fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                },
            })
            /* -- Check if request was successful -- */
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