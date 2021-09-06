// remove table scroll-cue when a user starts scrolling
let recipeLists = document.querySelectorAll('.beer-index-recipes-table-container');
for (let r of recipeLists) {
  r.addEventListener('scroll', toggleScrollCue)  
}

// event listener on Recipes and Brews buttons - when one is clicked, remove the 'd-none' class from the appropriate section and add it to the other.
let buttons = document.querySelectorAll('.beer-index-buttons button')
for (let button of buttons) {
    button.addEventListener('click', function() {
        let showTarget = this.getAttribute('data-target');
        let hideTarget = showTarget.indexOf('recipes') > 0 ? showTarget.replace('recipes', 'brews') : showTarget.replace('brews', 'recipes');
        document.querySelector(showTarget).classList.remove('d-none');
        document.querySelector(hideTarget).classList.add('d-none');
    })
}