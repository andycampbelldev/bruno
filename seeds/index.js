const mongoose = require('mongoose');
const Beer = require('../models/beer');
const Brewhouse = require('../models/brewhouse');
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
    await Beer.deleteMany({});
    await Brewhouse.deleteMany({});
    
    for (let i = 0; i < n; i++) {
        const beer = new Beer({
            name: `${random(first)}'s ${random(second)}`,
            style: random(style),
            description: `${random(descriptors)}, ${random(descriptors)}, & ${random(descriptors)}.`
        })
        await beer.save();
    }
    const brewhouse5 = new Brewhouse({
        name: '5 Gallon Batch',
        description: 'Use SS BME Kettle for boil. Bayou Classic for heat source.',
        boilOffRate: 4, // litres per hour
        grainAbsorptionRate: 1.02, //litres per kg
        mashOutTargetTemp: 77, //celsius
        spargeWaterTemp: 77, //celsius
        kettleLoss: 4, //litres
        mashHeatLoss: 1, //degrees celsius per hour
        mashOutWaterTemp: 100, //celsius
        grainSpecificHeat: 0.41, //use metric value of 0.41
        conversionPercent: 80,
        gristRatio: 3
    })
    await brewhouse5.save();

    const brewhouse2 = new Brewhouse({
        name: '2.5 Gallon Batch',
        description: 'Use SS BME Kettle for boil. Boil inside on stove.',
        boilOffRate: 3, // litres per hour
        grainAbsorptionRate: 1.02, //litres per kg
        mashOutTargetTemp: 77, //celsius
        spargeWaterTemp: 77, //celsius
        kettleLoss: 3, //litres
        mashHeatLoss: 1, //degrees celsius per hour
        mashOutWaterTemp: 100, //celsius
        grainSpecificHeat: 0.41, //use metric value of 0.41
        conversionPercent: 80,
        gristRatio: 3
    })

    await brewhouse2.save();
}

seedDB(10).then(() => {
    db.close();
})