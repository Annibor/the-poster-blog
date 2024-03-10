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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-comment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const commentId = this.dataset.commentId;
            if (confirm('Are you sure you want to delete this comment?')) {
                fetch(`/comment/${commentId}/delete/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (response.ok) {
                        document.getElementById(`comment-${commentId}`).remove();
                    } else {
                        alert('There was an error. Please try again.');
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
});