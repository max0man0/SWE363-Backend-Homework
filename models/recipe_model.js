const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function startDbConnection() {
    return sqlite.open({
        filename: 'recipes_store.db3',
        driver: sqlite3.Database
    })
}

/**
 * Recipe object has [id: number, title: string, image: string]
 * @return {Promise<Recipe[]>} an array of recipe objects
 */
async function getAllRecipes() {
    const db = await startDbConnection();
    const recipes = await db.all('select id, title, image from recipes');
    await db.close();
    // console.log(recipes);
    return recipes;
}

/**
 * Details object has [id: number, title: string, subtitle: string, make: string, cook_time: string, difficulty: string, image: string, steps: String[], ingredients: String[]]
 * 
 * @param {number} recipeId 
 * @return {Promise<Details>} an object containing the details of the recipe
 */
async function getRecipeDetail(recipeId) {
    const db = await startDbConnection();
    const details = await db.get(`select * from recipes where id = ${recipeId}`);
    if (details === undefined) {
        throw new Error("Recipe not found");
    }
    const steps = await db.all(`select step from method where recipe_id = ${recipeId}`);
    const ingredients = await db.all(`select item from ingredients where recipe_id = ${recipeId}`);
    details.steps = steps.map((step) => step.step);
    details.ingredients = ingredients.map((ingredient) => ingredient.item);
    // console.log(details);
    await db.close();
    return details;
}

/**
 * Comment object has [author: string, text: string]  
 * 
 * @param {number} recipeId 
 * @return {Promise<Comment[]>} an array of comment objects for the recipe
 */
async function getComments(recipeId) {
    const db = await startDbConnection();
    const comments = await db.all(`select author, comment from comments where recipe_id = ${recipeId}`);
    await db.close();
    return comments;
}

/**
 * @param {number} recipeId 
 * @param {Comment} comment must have [author: string, comment: string] otherwise throws an error
 * @return metadata about the inserted row
 */
async function addComment(recipeId, comment) {
    if (comment.author === undefined || comment.comment === undefined) {
        throw new Error("Comment object must have author and comment properties");
    }
    const db = await startDbConnection();
    const query = await db.prepare(`insert into comments(author, comment, recipe_id) values (?,?,?)`);
    const metadata = await query.run(comment.author, comment.comment, recipeId);
    await db.close();
    return metadata;
}

module.exports = {getAllRecipes, getRecipeDetail, getComments, addComment};