function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const editButtons = document.querySelectorAll('.edit-comment-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const submitButton = document.querySelector('#submitButton');
            submitButton.innerText = 'Update';
            // Additional logic to set the form action to update the comment
        });
    });
});
