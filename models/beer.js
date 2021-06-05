const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema({
    name: String,
    style: String,
    description: String,
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }],
    brews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brew"
    }]

})

module.exports = mongoose.model('Beer', beerSchema);

// const beer = {
//     id: '1',
//     name: 'Cascading Delete',
//     style: 'APA',
//     description: 'Here is a brief description of the beer itself. The style intended, as well as any other noteworthy features of the beer.',
//     recipes: [
//         {
//             id: 1,
//             version: 1,
//             dateAdded: '12 June 2020',
//             lastBrewed: '14 July 2020',
//             note: 'Original 19L'
//         },
//         {
//             id: 2,
//             version: 2,
//             dateAdded: '12 August 2020',
//             lastBrewed: '14 August 2020',
//             note: 'Half batch'
//         }
//     ],
//     brews: [
//         {
//             id: 1,
//             recipeId: 1,
//             brewDate: '14 June 2020'
//         },
//         {
//             id: 2,
//             recipeId: 1,
//             brewDate: '14 July 2020'
//         }
//     ]
// }