const mongoose = require('mongoose');
const Beer = require('../models/beer');
const Recipe = require('../models/recipe');
const { first, second, style, descriptors } = require('./seedHelpers');

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

const random = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async (n) => {
    
    for (let i = 0; i < n; i++) {
        const beer = new Beer({
            name: `${random(first)}'s ${random(second)}`,
            style: random(style),
            description: `${random(descriptors)}, ${random(descriptors)}, & ${random(descriptors)}.`
        })
        const recipe = new Recipe({
            created: new Date,
            recipeNotes: [],
            expectedOriginalGravity: 1.048,
            expectedFinalGravity: 1.012,
            expectedABV: 4.7,
            description: "Recipe for a 5G batch. Have previously only made this in smaller 2.5G batches, so this recipe simply doubles the original malt and hop quantities used. Like the original, this recipe finishes up quick and clean!",
            batchSize: 19,
            water : {
                    boilMinutes: 60,
                    source: "Tap",
                    adjustments: true,
                    mashOut: true,
                    adjustmentNotes: "1g Gypsum/Gallon",
                    brewhouse: "60c53c6623c6006eb2602f3b",
                    conversionPercent: 80,
                    boilOffRate: 4,
                    kettleLoss: 4,
                    grainAbsorptionRate: 1.02,
                    gristRatio: 3,
                    mashOutTargetTemp: 77,
                    mashOutWaterTemp: 100,
                    spargeWaterTemp: 77,
                    mashHeatLoss: 1,
                    grainSpecificHeat: 0.41,
                    boilOffVolume: 4,
                    preBoilVolume: 27,
                    grainAbsorptionVolume: 4.5,
                    totalMashWaterVolume: 31.5,
                    strikeVolume: 13.22,
                    mashEndTemp: 67,
                    mashOutVolume: 6.53,
                    spargeWaterVolume: 11.75,
                    postBoilVolume: 23
            },
            malts: [
                    {
                            name: "2 Row",
                            qty: 3.5,
                            ppg: 38,
                            gravityPoints: 41,
                            lovibond: 2,
                            mcu: 3.07,
                            srm: 3.22
                    },
                    {
                            name: "Wheat Malt",
                            qty: 0.454,
                            ppg: 37,
                            gravityPoints: 5,
                            lovibond: 2,
                            mcu: 0.4,
                            srm: 0.8
                    },
                    {
                            name: "Vienna",
                            qty: 0.227,
                            ppg: 36,
                            gravityPoints: 3,
                            lovibond: 4,
                            mcu: 0.4,
                            srm: 0.8
                    },
                    {
                            name: "Carapils",
                            qty: 0.227,
                            ppg: 33,
                            gravityPoints: 2,
                            lovibond: 2,
                            mcu: 0.2,
                            srm: 0.49
                    }
            ],
            maltTotals : {
                    qty: 4.408,
                    points: 51,
                    mcu: 4.07,
                    srm: 3.91,
                    srmHex: "#FFCA5A"
            },
            hops : [
                    {
                            name: "Southern Cross",
                            aa: 11,
                            qty: 11,
                            aau: 1.21,
                            usage: "Boil",
                            timing: "60"
                    },
                    {
                            name: "Sorachi Ace",
                            aa: 10,
                            qty: 11,
                            aau: 1.1,
                            usage: "Boil",
                            timing: "30"
                    },
                    {
                            name: "Sorachi Ace",
                            aa: 10,
                            qty: 11,
                            aau: 1.1,
                            usage: "Boil",
                            timing: "5"
                    },
                    {
                            name: "Fresh Rosemary",
                            aa: 0,
                            qty: 14,
                            aau: 0,
                            usage: "Boil",
                            timing: "Flameout, 10 mins whirlpool"
                    },
                    {
                            name: "Fresh Rosemary",
                            aa: 0,
                            qty: 14,
                            aau: 0,
                            usage: "Dry",
                            timing: "Secondary"
                    }
            ],
            hopTotals : {
                    qty: 61,
                    aau: 3.41
            },
            yeast : {
                    lab: "White Labs",
                    strain: "WLP029 German Ale/Kolsch",
                    flocculation: "Medium",
                    attenuation: 75,
                    state: "Liquid",
                    qty: "1 PurePitch",
                    pitchTemp: 27,
                    starter: true,
                    starterNotes: "1L 10:1 Starter. We'll use the whole starter on this batch.\r\n\r\nAdd water to 100g of DME until you have 1L total (about 870g of water). Add 1/4 tsp yeast nutrient and boil 15 mins, cool, and pitch yeast.\r\n\r\n12-18 hours on stir plate at around 22C (may need to use ferm chamber if ambient too hot)."
            },
            mash : {
                    method: "Single Step Infusion",
                    spargeMethod: "Fly",
                    totalMinutes: 60
            },
            mashSched : [
                    {
                            restType: "Conversion",
                            temp: 68,
                            minutes: 60
                    }
            ],
            finings : [
                    {
                            name: "Whirlfloc",
                            qty: "1/2 tablet",
                            usage: "Final 5 mins boil"
                    }
            ],
            ferm : [
                    {
                            stage: "Primary",
                            temp: 19,
                            days: 6
                    },
                    {
                            stage: "Secondary",
                            temp: 19,
                            days: 4
                    }
            ],
            fermTotals: {
                    days: 10
            },
            beer: beer.id,
            version: beer.nextVersion,
            expectedPreBoilGravity: 1.041
        })

        beer.recipes.push(recipe._id)
        await beer.save();
        await recipe.save();
    }
}

//loop over each beer in the database and create a recipe for each. Use a brewhouse.

seedDB(1).then(() => {
    db.close();
})