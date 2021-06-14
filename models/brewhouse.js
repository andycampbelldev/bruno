const mongoose = require('mongoose');

const brewhouseSchema = new mongoose.Schema({
    name: String,
    description: String,
    boilOffRate: Number, // litres per hour
    kettleLoss: Number, //litres
    grainAbsorptionRate: Number, //litres per kg
    mashOutTargetTemp: Number, //celsius
    spargeWaterTemp: Number, //celsius
    mashHeatLoss: Number, //degrees celsius per hour
    mashOutWaterTemp: Number, //celsius
    grainSpecificHeat: Number, //use metric value of 0.41
    conversionPercent: Number,
    gristRatio: Number //L of Strike Water per kg of grain
})

module.exports = mongoose.model('Brewhouse', brewhouseSchema);