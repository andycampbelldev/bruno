// remove table scroll-cue when a user starts scrolling
let recipeLists = document.querySelectorAll('.beer-index-recipes-table-container');
for (let r of recipeLists) {
  r.addEventListener('scroll', toggleScrollCue)  
}



// event listener on Recipes and Brews buttons - when one is clicked, remove the 'show' class from the other to cause it to collapse
// let buttons = document.querySelectorAll('.beer-index-buttons button')
// for (let button of buttons) {
//     button.addEventListener('click', function() {
//         let target = this.getAttribute('data-target');
//         target = target.indexOf('recipes') > 0 ? target.replace('recipes', 'brews') : target.replace('brews', 'recipes');
//         document.querySelector(target).classList.remove('show');
//     })
// }

let buttons = document.querySelectorAll('.beer-index-buttons button')
for (let button of buttons) {
    button.addEventListener('click', function() {
        let showTarget = this.getAttribute('data-target');
        let hideTarget = showTarget.indexOf('recipes') > 0 ? showTarget.replace('recipes', 'brews') : showTarget.replace('brews', 'recipes');
        document.querySelector(showTarget).classList.remove('d-none');
        document.querySelector(hideTarget).classList.add('d-none');
    })
}