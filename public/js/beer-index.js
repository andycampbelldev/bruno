// remove table scroll-cue when a user starts scrolling
let recipes = document.querySelectorAll('.beer-index-recipes-table-container');
for (let recipe of recipes) {
  recipe.addEventListener('scroll', toggleScrollCue)  
}