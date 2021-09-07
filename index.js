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
    const beers = await Beer.find({});
    res.render('beers/index', { beers, scripts: [] });
})

// create beer
app.post('/beers', async (req, res) => {
    const beer = new Beer(req.body.beer);
    await beer.save();
    res.redirect('/beers');
})

// new beer form
app.get('/beers/new', async (req, res) => {
    res.render('beers/new', {scripts: []});
})

// show beer
app.get('/beers/:id', async (req, res) => {
    const beer = await Beer.findById(req.params.id).populate('recipes');
    res.render('beers/show', {beer, scripts: ['general.js', 'beer-show.js']});
})

// edit beer
app.put('/beers/:id', async (req, res) => {
    await Beer.findByIdAndUpdate(req.params.id, req.body.beer);
    res.redirect(`/beers/${req.params.id}`);
})

// edit beer form
app.get('/beers/:id/edit', async (req, res) => {
    const beer = await Beer.findById(req.params.id);
    res.render('beers/edit', { beer, scripts: [] });
})

// delete beer
app.delete('/beers/:id', async (req, res) => {
    const { id } = req.params;
    //when brew data available, delete any brews related to the deleted Beer.
    await Recipe.deleteMany({beer: id});
    await Beer.findByIdAndDelete(id);
    res.redirect(`/beers`);
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
    const version = beer.nextVersion
    const recipe = new Recipe(req.body);
    recipe.beer = beer._id;
    recipe.version = version;
    recipe.created = new Date;
    await recipe.save();
    beer.recipes.push(recipe._id);
    beer.nextVersion += 1;
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
    const recipe = req.body;
    // ensure any arrays not included in the form are saved as empty arrays
    recipe.recipeNotes = recipe.recipeNotes || [];
    recipe.malts = recipe.malts || [];
    recipe.hops = recipe.hops || [];
    recipe.mashSched = recipe.mashSched || [];
    recipe.finings = recipe.finings || [];
    recipe.ferm = recipe.ferm || [];
    recipe.lastModified = new Date;
    await Recipe.findByIdAndUpdate(req.params.recipe, recipe);
    res.redirect(`/beers/${req.params.beer}/recipes/${req.params.recipe}`);
})

// delete recipe
app.delete('/beers/:beer/recipes/:recipe', async (req, res) => {
    const beer = await Beer.findById(req.params.beer);
    const recipe = await Recipe.findById(req.params.recipe);
    //when brew data is available, be sure to delete brew data for the deleted recipe first.
    await Recipe.findByIdAndDelete(req.params.recipe);
    beer.deletedVersions.push(recipe.version);
    await beer.save();
    res.redirect(`/beers/${beer._id}`);
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