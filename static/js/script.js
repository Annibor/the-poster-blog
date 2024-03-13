function getCSRFToken() {
    console.log("Getting CSRF Token");
    return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Function to toggle the new comment form visibility
    function toggleNewCommentForm() {
      let newCommentForm = document.getElementById('commentForm');
      if (newCommentForm) {
        newCommentForm.style.display = newCommentForm.style.display === 'none' ? 'block' : 'none';
      }
    }
  
    // Function to initialize event listeners on edit buttons
    function initializeEditButtons() {
      document.querySelectorAll('.edit-comment-btn').forEach(button => {
        button.addEventListener('click', function() {
          let commentId = this.getAttribute('data-comment-id');
          let postSlug = this.getAttribute('data-post-slug');
          console.log(`Edit button clicked for comment ID: ${commentId}, post slug: ${postSlug}`); // Debugging log
  
          let editForm = document.getElementById(`edit-comment-form-${commentId}`);
          editForm.style.display = 'block';
          toggleNewCommentForm();
        });
      });
    }
  
    // Function to initialize event listeners on cancel buttons
    function initializeCancelButtons() {
      document.querySelectorAll('.cancel-edit-btn').forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent form submission or any default action
          let commentId = this.getAttribute('data-comment-id');
          console.log(`Cancel button clicked for comment ID: ${commentId}`); // Debugging log
  
          let editForm = document.getElementById(`edit-comment-form-${commentId}`);
          editForm.style.display = 'none';
          toggleNewCommentForm();
        });
      });
    }
  
    // Call the initialization functions to set up event listeners
    initializeEditButtons();
    initializeCancelButtons();
  });
  
  // Delete comment
  document.querySelectorAll(".delete-comment-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const commentId = this.dataset.commentId;
      const postSlug = this.getAttribute("data-post-slug");
  
      console.log(`Attempting to delete comment ID: ${commentId}`);
  
      if (confirm("Are you sure you want to delete this comment?")) {
        fetch(`/blog/post/${postSlug}/comment/${commentId}/delete/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": getCSRFToken(),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            console.log("Delete response status:", response.status);
            if (response.ok) {
              console.log(document.getElementById(`comment${commentId}`));
              document.getElementById(`comment${commentId}`).remove();
              console.log(document.getElementById(`comment${commentId}`));
            } else {
              alert("There was an error. Please try again.");
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    });

    document.querySelectorAll('.save-edit-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default form submission
            const commentId = this.getAttribute('data-comment-id');
            const postSlug = this.getAttribute('data-post-slug');
            const commentBody = document.getElementById(`edit-body-${commentId}`).value;

            console.log(`Saving edits for comment ID: ${commentId}`);

            fetch(`/blog/post/${postSlug}/comment/${commentId}/update/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({body: commentBody}),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update the comment display on the page
                    document.querySelector(`#comment${commentId} > div`).textContent = commentBody;
                    // Hide the edit form
                    document.getElementById(`edit-comment-form-${commentId}`).style.display = 'none';
                    toggleNewCommentForm();
                    console.log("Comment updated successfully");
                } else {
                    alert('Error updating comment: ' + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    });
  });
  
  