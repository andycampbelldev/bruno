const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// connect to dev db on Macbook
mongoose.connect('mongodb://localhost:27017/bruno-dev', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

//models
const Beer = require('./models/beer');
const Recipe = require('./models/recipe');
const Brew = require('./models/brew');
const Brewhouse = require('./models/brewhouse');

// temp sample data from js file -- remove this soon
const { beers, brews, recipes, notes } = require('./data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// index for beers
app.get('/beers', async (req, res) => {
    const beers = await Beer.find({}).populate('recipes');
    res.render('beers/index', { beers, scripts: ['general.js', 'beer-index.js'] });
})

// create beer
app.post('/beers', async (req, res) => {
    const beer = new Beer(req.body.beer);
    await beer.save();
    res.redirect('/beers');
})

// edit beer
app.put('/beers/:id', async (req, res) => {
    await Beer.findByIdAndUpdate(req.params.id, req.body.beer);
    res.redirect('/beers');
})

// edit beer form
app.get('/beers/:id/edit', async (req, res) => {
    const beer = await Beer.findById(req.params.id);
    res.render('beers/edit', { beer, scripts: [] });
})

// delete beer
app.delete('/beers/:id', async (req, res) => {
    const { id } = req.params;
    await Beer.findByIdAndDelete(id);
    res.redirect(`/beers`);
})

// new beer form
app.get('/beers/new', async (req, res) => {
    res.render('beers/new', {scripts: []});
})

// index for brewhouse
app.get('/brewhouses', async (req, res) => {
    const brewhouses = await Brewhouse.find({});
    res.render('brewhouses/index', { brewhouses, scripts: [] });
})

// create brewhouse
app.post('/brewhouses', async (req, res) => {
    const brewhouse = new Brewhouse(req.body.brewhouse);
    await brewhouse.save();
    res.redirect('/brewhouses');
})

// new brewhouse
app.get('/brewhouses/new', (req, res) => {
    res.render('brewhouses/new', { scripts: [] });
})

// edit brewhouse
app.get('/brewhouses/:id/edit', async (req, res) => {
    const brewhouse = await Brewhouse.findById(req.params.id);
    res.render('brewhouses/edit', { brewhouse, scripts: [] });
})

// update brewhouse
app.put('/brewhouses/:id', async (req, res) => {
    await Brewhouse.findByIdAndUpdate(req.params.id, req.body.brewhouse);
    res.redirect('/brewhouses');
})

// get brewhouse (for recipe new/edit form AJAX)
app.get('/brewhouses/:id', async (req, res) => {
    const brewhouse = await Brewhouse.findById(req.params.id);
    res.send(brewhouse);
})

// other beer routes
// GET /beers/:id - show all info for a given beer - e.g. all recipes, brews, a section containing all photos
// GET /beers/:id/edit - edit form to edit the beer name, style, description.
// PATCH /beers/:id/ - update a particular beer

// new recipe form
app.get('/beers/:beer/recipes/new', async (req, res) => {
    const beer = await Beer.findById(req.params.beer);
    const brewhouses = await Brewhouse.find({});
    res.render('recipes/new', { beer, brewhouses, scripts: ['general.js','recipe-form-control.js', 'recipe-calc.js'] });
})

// create new recipe
app.post('/beers/:beer/recipes', async (req, res) => {
    const beer = await Beer.findById(req.params.beer);
    //determine the version number of the recipe. For now, this is basically a sequence number. This logic will need to change when the ability to copy a recipe is introduced.
    const version = beer.recipes.length + 1;
    const recipe = new Recipe(req.body);
    recipe.beer = beer._id;
    recipe.version = version;
    await recipe.save();
    beer.recipes.push(recipe._id);
    await beer.save();
    res.redirect(`/beers/${beer._id}/recipes/${recipe._id}`);
})

// show recipe
app.get('/beers/:beer/recipes/:recipe', async (req, res) => {
    const beer = await Beer.findById(req.params.beer);
    const recipe = await Recipe.findById(req.params.recipe).populate('water.brewhouse');
    res.render('recipes/show', { beer, recipe, scripts: ['general.js'] });
})

// edit recipe form
app.get('/beers/:beer/recipes/:recipe/edit', async (req, res) => {
    const beer = await Beer.findById(req.params.beer);
    const recipe = await Recipe.findById(req.params.recipe).populate('water.brewhouse');
    const brewhouses = await Brewhouse.find({});
    res.render('recipes/edit', { beer, brewhouses, recipe, scripts: ['general.js','recipe-form-control.js', 'recipe-calc.js'] });
})

// update recipe
app.put('/beers/:beer/recipes/:recipe', async (req, res) => {
    // ensure any arrays not included in the form are saved as empty arrays
    req.body.recipeNotes = req.body.recipeNotes || [];
    req.body.malts = req.body.malts || [];
    req.body.hops = req.body.hops || [];
    req.body.mashSched = req.body.mashSched || [];
    req.body.finings = req.body.finings || [];
    req.body.ferm = req.body.ferm || [];
    await Recipe.findByIdAndUpdate(req.params.recipe, req.body);
    res.redirect(`/beers/${req.params.beer}/recipes/${req.params.recipe}`);
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