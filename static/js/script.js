/* Function to retrieve the CSRF token needed for POST requests in Django */
function getCSRFToken() {
    /* Selects the CSRF token input field and retrieves its value */
    return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
}

/* Event listener for when the DOM is fully loaded */
document.addEventListener("DOMContentLoaded", function() {
    /* Function to toggle the visibility of the new comment form */
    function toggleNewCommentForm() {
        let newCommentForm = document.getElementById('commentForm');
        /* Checks if the form is visible and toggles the display state */
        newCommentForm.style.display = newCommentForm.style.display === 'none' ? 'block' : 'none';
    }

    /* Attach event listeners to all edit buttons */
    document.querySelectorAll('.edit-comment-btn').forEach(button => {
        button.addEventListener('click', function() {
            /* Retrieves the comment ID from the data attribute */
            const commentId = this.getAttribute('data-comment-id');
            /* Selects the corresponding edit form for this comment */
            const editForm = document.getElementById(`edit-comment-form-${commentId}`);
            /* Displays the edit form */
            editForm.style.display = 'block';
            /* Hides the new comment form */
            toggleNewCommentForm();
        });
    });

    /* Attach event listeners to all cancel buttons */
    document.querySelectorAll('.cancel-edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            /* Retrieves the comment ID from the data attribute */
            const commentId = this.getAttribute('data-comment-id');
            /* Selects the corresponding edit form for this comment */
            const editForm = document.getElementById(`edit-comment-form-${commentId}`);
            /* Hides the edit form */
            editForm.style.display = 'none';
            /* Shows the new comment form */
            toggleNewCommentForm();
        });
    });

    /* Attach event listeners to all save buttons */
    document.querySelectorAll('.save-edit-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            /* Prevents the default form submission */
            e.preventDefault();
            /* Retrieves the comment ID and the post slug from data attributes */
            const commentId = this.getAttribute('data-comment-id');
            const postSlug = document.getElementById('commentForm').getAttribute('data-post-slug');
            /* Selects the textarea within the edit form and retrieves the edited comment text */
            const commentBody = document.getElementById(`edit-body-${commentId}`).value;

            /* Checks if the comment body is not just whitespace */
            if (!commentBody.trim()) {
                alert('Comment body cannot be empty.');
                return;
            }

            /* Sends an AJAX POST request to the server to update the comment */
            fetch(`/blog/post/${postSlug}/comment/${commentId}/update/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "Content-Type": "application/json",
                },
                /* Includes the updated comment text in the request body */
                body: JSON.stringify({ body: commentBody }),
            })
            /* Parses the JSON response from the server */
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            /* Handles the server's response */
            .then(data => {
                if (data.status === 'success') {
                    /* Selects the comment container and updates its content with the new comment text */
                    const commentTextContainer = document.getElementById(`comment${commentId}`);
                     /* Converts newlines to <br> tags for proper display */
                    commentTextContainer.innerHTML = commentBody.replace(/\n/g, "<br>");
                    /* Hides the edit form */
                    const editForm = document.getElementById(`edit-comment-form-${commentId}`);
                    editForm.style.display = 'none';
                    /* Shows the new comment form again */
                    toggleNewCommentForm();
                } else {
                    /* Alerts the user if there was an error updating the comment */
                    alert('Error updating comment: ' + data.message);
                }
            })
            /* Catches and logs any errors in the fetch operation */
            .catch(error => {
                console.error("Error:", error);
                alert('Error updating comment: ' + error.message);
            });
        });
    });
});

/* Iterates over each "delete comment" button and attaches an event listener */
document.querySelectorAll(".delete-comment-btn").forEach((button) => {
    button.addEventListener("click", function () {
        /* Retrieves the comment ID and post slug stored in the button's data attributes */
        const commentId = this.dataset.commentId;
        const postSlug = this.getAttribute("data-post-slug");
        
        /* Logs an attempt to delete the comment */
        console.log(`Attempting to delete comment ID: ${commentId}`);
        
        /* Confirms with the user if they really want to delete the comment */
        if (confirm("Are you sure you want to delete this comment?")) {
          /* Sends a fetch request to the server to delete the comment */
          fetch(`/blog/post/${postSlug}/comment/${commentId}/delete/`, {
            method: "POST",
            headers: {
              "X-CSRFToken": getCSRFToken(), /* Includes CSRF token for security */
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              /* Logs the HTTP status of the response */
              console.log("Delete response status:", response.status);
              if (response.ok) {
                /* If the response is OK, remove the comment's DOM element */
                console.log(document.getElementById(`comment${commentId}`));
                document.getElementById(`comment-container${commentId}`).remove();
                console.log(document.getElementById(`comment${commentId}`)); // This will log null since the element is removed
              } else {
                /* Alerts the user if there was a server-side error */
                alert("There was an error. Please try again.");
              }
            })
            .catch((error) => {
              /* Logs any error that occurred during the fetch operation */
              console.error("Error:", error);
            });
        }
    });
});