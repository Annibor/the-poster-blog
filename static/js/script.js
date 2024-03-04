document.addEventListener("DOMContentLoaded", function() {
    const editButtons = document.querySelectorAll(".edit-comment-btn"); 
    const commentText = document.querySelector("#bodyField"); 
    const commentForm = document.querySelector("#commentForm"); 
    const submitButton = document.querySelector("#submitButton");

    console.log("editButton:", editButtons);
    console.log("commentText:", commentText);
    console.log("commentForm:", commentForm);
    console.log("submitButton:", submitButton);
    console.log("Edit buttons found: ", editButtons.length);
});