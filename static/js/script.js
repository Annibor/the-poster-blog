document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded.");

    const editButtons = document.querySelectorAll(".edit-comment-btn");
    console.log(`Found ${editButtons.length} edit buttons.`);

    const commentText = document.querySelector("#bodyField");
    const commentForm = document.querySelector("#commentForm");
    const submitButton = document.querySelector("#submitButton");

    editButtons.forEach((button, index) => {
        console.log(`Setting up click listener for button ${index + 1}`);
        button.addEventListener("click", function() {
            const commentId = this.getAttribute("data-comment-id");
            const postSlug = commentForm.getAttribute("data-post-slug");
            const commentContent = document.querySelector(`#comment${commentId}`).innerText;

            console.log(`Edit button clicked for comment ID: ${commentId}`);
            console.log(`Post slug: ${postSlug}`);
            console.log(`Comment content: ${commentContent}`);

            commentText.value = commentContent;
            submitButton.innerText = "Update";
            console.log("Submitting form to URL:", commentForm.action);
            commentForm.action = `/blog/post/${postSlug}/comment/${commentId}/`;
            console.log(`Form action set to: ${commentForm.action}`);
        });
    });

    // Optional: Add any pre-submit logic here
    commentForm.onsubmit = function(e) {
        console.log("Form submission intercepted. Submitting normally.");
        console.log(`Form action at submission: ${commentForm.action}`);
        // No need to preventDefault or use fetch, as the form will submit normally
    };
});