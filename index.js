const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// connect to dev db. For now will only work on Macbook
mongoose.connect('mongodb://localhost:27017/bruno-dev', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

//models
const Beer = require('./models/beer');


// temp sample data from js file
//const { beers, brews, recipes, notes } = require('./data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// index for beers
app.get('/beers', async (req, res) => {
    const beers = await Beer.find({});
    res.render('beers/show', { beers });
})

// other beer routes
// GET /beers/:id - show all info for a given beer - e.g. all recipes, brews, a section containing all photos
// GET /beers/:id/edit - edit form to edit the beer name, style, description.
// PATCH /beers/:id/ - update a particular beer

// read particular recipe
app.get('/beers/:beer/recipes/:recipe', (req, res) => {
    const i = beers.map(beer => beer.id).indexOf(req.params.beer);
    const beer = beers[i];
    const j = recipes.map(recipe => recipe.id).indexOf(req.params.recipe);
    const recipe = recipes[j];
    res.render('recipes/show', { recipe, beer });
})

// read list of brews for a recipe
app.get('/beers/:beer/recipes/:recipe/brews', (req, res) => {
    const i = recipes.map(recipe => recipe.id).indexOf(req.params.recipe);
    const recipe = recipes[i];
    const j = beers.map(beer => beer.id).indexOf(req.params.beer);
    const beer = beers[j];
    const recipeBrews = brews.filter(brew => brew.recipe === req.params.recipe)
    res.render('recipes/brews/index', { recipe, beer, recipeBrews });
})

// read particular brew 
app.get('/beers/:beer/recipes/:recipe/brews/:brew', (req, res) => {
    const i = beers.map(beer => beer.id).indexOf(req.params.beer);
    const beer = beers[i];
    const j = recipes.map(recipe => recipe.id).indexOf(req.params.recipe);
    const recipe = recipes[j];
    const k = brews.map(brew => brew.id).indexOf(req.params.brew);
    const brew = brews[k];
    const brewNotes = notes.filter(note => note.brew === req.params.brew)
    res.render('brews/show', { beer, recipe, brew, brewNotes });
})

app.get('/brews/:id/recipe', (req, res) => {
    const i = brews.map(brew => brew.id).indexOf(req.params.id);
    const brew = brews[i];
    res.render('recipes/show')
})

app.get('/brews/:id/notes', (req, res) => {
    const i = brews.map(brew => brew.id).indexOf(req.params.id);
    const brew = brews[i];
    res.render('notes/index', { brew });
})

app.listen(port, () => {
    console.log(`bruno listening on Port ${port}`)
})