const mongoose = require('mongoose');
const Beer = require('../models/beer');
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
    for (let i = 0; i < n; i++) {
        const beer = new Beer({
            name: `${random(first)}'s ${random(second)}`,
            style: random(style),
            description: `${random(descriptors)}, ${random(descriptors)}, & ${random(descriptors)}.`
        })
        await beer.save();
    }
}

seedDB(20).then(() => {
    db.close();
})