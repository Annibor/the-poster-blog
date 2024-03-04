document.addEventListener("DOMContentLoaded", function() {
    const editButtons = document.querySelectorAll(".edit-comment-btn"); 
    const commentText = document.querySelector("#bodyField"); 
    const commentForm = document.querySelector("#commentForm"); 
    const submitButton = document.querySelector("#submitButton");


    if (editButtons) {
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
    }
});