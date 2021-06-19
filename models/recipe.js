const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    beer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beer"
    },
    version: Number,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    description: String,
    recipeNotes: [String],
    batchSize: Number,
    targetABV: Number,
    targetOG: Number,
    targetFG: Number,
    boilMinutes: Number,
    malts: [{
        name: String,
        qty: Number,
        ppg: Number,
        gravityPoints: Number,
        lovibond: Number, //consider whether we can record this in metric terms to be consistent
        mcu: Number,
        srm: Number
    }],
    maltTotals: {
        qty: Number,
        points: Number,
        mcu: Number,
        srm: Number,
    },
    hops: [{
        name: String,
        aa: Number,
        qty: Number,
        aau: Number,
        usage: String,
        timing: String
    }],
    hopTotals: {
        qty: Number,
        aau: Number
    },
    yeast: {
        lab: String,
        strain: String,
        state: String,
        qty: String,
        pitchTemp: Number,
        starter: Boolean,
        starterNotes: String
    },
    ferm: [{
        stage: String,
        temp: Number,
        days: Number
    }],
    fermTotals: {
        days: Number
    },
    water: {
        source: String,
        adjustments: Boolean,
        adjustmentNotes: String,
        brewhouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brewhouse"
        },
        boilOffRate: Number,
        grainAbsorptionRate: Number,
        kettleLoss: Number
    },
    mash: {
        method: String,
        gristRatio: Number,
        absorptionRatio: Number,
        schedule: [{
            restType: String,
            temp: Number,
            minutes: Number
        }],
        totalMinutes: Number,
        mashOut: Boolean,
        spargeMethod: String
    },
    finings: [{
        name: String,
        qty: String,
        usage: String
    }],
    brews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brew"
    }]
})

module.exports = mongoose.model('Recipe', recipeSchema);