document.addEventListener("DOMContentLoaded", function() {
    const editButtons = document.querySelectorAll(".edit-comment-btn"); 
    const commentText = document.querySelector("#bodyField"); 
    const commentForm = document.querySelector("#commentForm"); 
    const submitButton = document.querySelector("#submitButton");


    if (editButtons) {
        editButtons.forEach(button => {
            button.addEventListener("click", function() {
                const commentId = this.getAttribute("data-comment-id");
                const commentContent = document.querySelector(`#comment${commentId}`).innerText;
                
                console.log(`Editing comment ID: ${commentId}`); 
                console.log(`Current comment content: ${commentContent}`);
            });
        });
    } else {
        console.log("No edit buttons found.");
    }
});