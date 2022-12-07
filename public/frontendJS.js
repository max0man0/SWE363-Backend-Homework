/**
 * send and AJAX get request to “/recipes/:recipeId/comments” and display it in the document
 * @param {number} recipeId 
 */
async function showComments(recipeId) {
    const commentsContainer = document.getElementById("comments");
    let output = "<strong>All comments:</strong>";
    const res = await fetch(`http://127.0.0.1:3000/recipes/${recipeId}/comments`);
    if (res.ok) {
        const list = await res.json();
        output += list.map((comment) => `
        <div class="comment-card">
        <p>${comment.comment}</p>
        <p>- ${comment.author}</p>
        </div>
        `).join("");
        commentsContainer.innerHTML = output;
    }
}

/**
 * Unhides the comments section
 * @param {number} recipeId 
 */
async function seeComments(recipeId) {
    const commentArticle = document.getElementById("comments-article");
    if (commentArticle.className.includes("hide")){
        await showComments(recipeId);
        commentArticle.classList.remove("hide");
    }
    else {
        commentArticle.classList.add("hide");
    }
}

/**
 * send an AJAX post request to “/recipes/:recipeId/comments” and updates the page
 * @param {number} recipeId 
 */
async function sendComment(recipeId) {
    const authorHTML = document.getElementById("author");
    const commentHTML = document.getElementById("comment");
    const author = authorHTML.value;
    const comment = commentHTML.value;
    authorHTML.value = "";
    commentHTML.value = "";

    await fetch(`http://127.0.0.1:3000/recipes/${recipeId}/comments`,{
        headers:{
            'Content-Type':'Application/json'
        },
        method:'POST',
        body: JSON.stringify({author: author, comment: comment})
    });
    await showComments(recipeId);
}