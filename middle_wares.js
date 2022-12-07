function checkNumericRecipeId(req, res, next) {
    // if not a number, then send not found
    if (isNaN(req.params.recipeId)){
        notFound(req, res, next);
    }
    else {
        next();
    }
}

function notFound(req, res, next) {
    res.status(404).end(`<h1>Error: Not Found</h1><a href="/">Return to main page</a>`);
}

module.exports = {notFound, checkNumericRecipeId}