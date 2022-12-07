const express = require('express');
const njk = require('nunjucks');
const app = express()
const port = 3000
const recipeModel = require('./models/recipe_model.js');
const middleWares = require('./middle_wares.js');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
njk.configure('views', {express: app});

app.get('/', async (req, res) => res.render('index.njk', {recipes: await recipeModel.getAllRecipes()}));

app.get('/recipes/:recipeId', middleWares.checkNumericRecipeId,
 async (req, res, next) => {
    try{
        res.render('recipe.njk', {details: await recipeModel.getRecipeDetail(parseInt(req.params.recipeId))});
    }
    catch (e) {
        next();
    }
}, middleWares.notFound);

app.get('/recipes/:recipeId/comments', middleWares.checkNumericRecipeId,
    async (req, res, next) => {
    try{
        res.json(await recipeModel.getComments(parseInt(req.params.recipeId)));
    }
    catch (e) {
        next();
    }
    },
    middleWares.notFound);

app.post('/recipes/:recipeId/comments', middleWares.checkNumericRecipeId,
async (req, res, next) => {
    try{
        const comment = {author: req.body.author, comment: req.body.comment};
        await recipeModel.addComment(parseInt(req.params.recipeId), comment);
    }
    catch (e) {
        next();
    }  
    });

app.get('/test', async (req, res) => {
    
    recipeModel.getRecipeDetail(1);
    // res.end(`<pre>${JSON.stringify(recipes)}</pre>`);
    res.end("<h1>Testing</h1>");
});

app.use(middleWares.notFound);

app.listen(port, () => console.log(`Server listening on http://127.0.0.1:${port}`))
