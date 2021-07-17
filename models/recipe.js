const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    beer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beer"
    },
    created: {
        type: Date, 
        default: new Date
    },
    lastBrewed: Date,
    lastModified: Date,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    version: Number,
    batchSize: Number,
    brews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brew"
    }],
    description: String,
    recipeNotes: [String],
    expectedABV: Number,
    expectedFinalGravity: Number,
    expectedOriginalGravity: Number,
    expectedPreBoilGravity: Number,
    ferm: [{
        stage: String,
        temp: Number,
        days: Number
    }],
    fermTotals: {
        days: Number
    },
    finings: [{
        name: String,
        qty: String,
        usage: String
    }],
    hops: [{
        name: String,
        aa: Number,
        aau: Number,
        qty: Number,
        timing: String,
        usage: String
    }],
    hopTotals: {
        aau: Number,
        qty: Number
    },
    malts: [{
        name: String,
        gravityPoints: Number,
        lovibond: Number,
        mcu: Number,
        ppg: Number,
        qty: Number,
        srm: Number
    }],
    maltTotals: {
        mcu: Number,
        points: Number,
        qty: Number,
        srm: Number,
        srmHex: String
    },
    mash: {
        method: String,
        spargeMethod: String,
        totalMinutes: Number
    },
    mashSched: [{
        minutes: Number,
        restType: String,
        temp: Number
    }],
    water: {
        adjustments: Boolean,
        adjustmentNotes: String,
        boilMinutes: Number,
        boilOffRate: Number,
        boilOffVolume: Number,
        brewhouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brewhouse"
        },
        grainAbsorptionRate: Number,
        grainAbsorptionVolume: Number,
        grainSpecificHeat: Number,
        gristRatio: Number,
        kettleLoss: Number,
        mashEndTemp: Number,
        mashHeatLoss: Number,
        mashOut: Boolean,
        mashOutTargetTemp: Number,
        mashOutWaterTemp: Number,
        mashOutVolume: Number,
        preBoilVolume: Number,
        source: String,
        spargeWaterVolume: Number,
        strikeVolume: Number,
        totalMashWaterVolume: Number
    },
    yeast: {
        lab: String,
        strain: String,
        attenuation: Number,
        flocculation: String,
        pitchTemp: Number,
        qty: String,
        starter: Boolean,
        starterNotes: String,
        state: String
    }
})

module.exports = mongoose.model('Recipe', recipeSchema);