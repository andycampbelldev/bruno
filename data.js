const beers = [
    {
        id: '1',
        name: 'Cascading Delete',
        style: 'APA',
        description: 'Here is a brief description of the beer itself. The style intended, as well as any other noteworthy features of the beer.',
        recipes: [
            {
                id: 1,
                version: 1,
                dateAdded: '12 June 2020',
                lastBrewed: '14 July 2020',
                note: 'Original 19L'
            },
            {
                id: 2,
                version: 2,
                dateAdded: '12 August 2020',
                lastBrewed: '14 August 2020',
                note: 'Half batch'
            }
        ],
        brews: [
            {
                id: 1,
                recipeId: 1,
                brewDate: '14 June 2020'
            },
            {
                id: 2,
                recipeId: 1,
                brewDate: '14 July 2020'
            }
        ]
    },
    {
        id: '2',
        name: 'Ghost Diddle',
        style: 'Blonde Ale',
        description: 'Here is a brief description of the beer itself. Ghost Diddle has a phantom bitterness.',
        recipes: [],
        brews: []
    },
    {
        id: '3',
        name: `Fiddler's Sorrow`,
        style: 'Porter',
        description: `Here is a brief description of the beer itself. Fiddler's Sorrow is a heavy beverage.`,
        recipes: [],
        brews: []
    },
]

const recipes = [
    {
        id: '1',
        beer: '1',
        version: '1',
        parent: '',
        recipe: {
            description: "Repeat of the 01/21/2017 “Blue Glow” (originally based on Palmer's Lady Liberty Ale) with further hop substitutions.",
            recipeNotes: [
                {
                    content: "This grain bill does have a tendency to get stuck during lautering, so be careful."
                },
                {
                    content: "Clarity tends to be an issue with this one. A cold crash is definitely recommended."
                }
            ],
            batchSize: '19',
            targetABV: '5.5',
            targetOG: '1.047',
            targetFG: '1.010',
            boilMinutes: '60',
            brewhouseProfile: '1',
            malts: [
                {
                    name: 'Marris Otter',
                    qty: '3.2',
                    maxPPG: '38',
                    points: '41.2',
                    srmLbG: '2',
                    mcu: '3.4',
                    srm: '3.3'
                },
                {
                    name: 'Crystal Medium',
                    qty: '0.23',
                    maxPPG: '34',
                    points: '2.6',
                    srmLbG: '2',
                    mcu: '3.4',
                    srm: '3.3'
                },
                {
                    name: 'Amber',
                    qty: '0.23',
                    maxPPG: '35',
                    points: '2.7',
                    srmLbG: '2',
                    mcu: '3.4',
                    srm: '3.3'
                },
                {
                    name: 'Munich',
                    qty: '0.23',
                    maxPPG: '35',
                    points: '2.7',
                    srmLbG: '2',
                    mcu: '3.4',
                    srm: '3.3'
                }
            ],
            maltTotals: {
                qty: 3.89,
                points: 49.2,
                mcu: 13.6,
                srm: 13.2
            },
            hops: [
                {
                    name: 'Chinook',
                    aa: '12.4',
                    qty: '12.4',
                    aau: '1.54',
                    usage: 'Boil',
                    timing: '60'
                },
                {
                    name: 'Crystal',
                    aa: '4.1',
                    qty: '20.4',
                    aau: '0.84',
                    usage: 'Boil',
                    timing: '30'
                },
                {
                    name: 'Motueka',
                    aa: '6.5',
                    qty: '25.8',
                    aau: '1.68',
                    usage: 'Boil',
                    timing: '15'
                },
                {
                    name: 'Cascade',
                    aa: '5.5',
                    qty: '32.5',
                    aau: '1.79',
                    usage: 'Dry',
                    timing: 'Secondary'
                },
            ],
            hopTotals: {
                qty: 91.1,
                aau: 5.85
            },
            yeast: {
                lab: 'Safeale',
                strain: 'US-05 Dry Ale Yeast',
                state: 'Dry',
                qty: '1 packet',
                pitchTemp: '27',
                starter: true,
                starterNotes: [
                    {
                        content: "2L starter at 10:1 water to DME, 1/4 tsp yeast nutrient."
                    },
                    {
                        content: "2 days on stir plate at around 20C"
                    }
                ]
            },
            ferm: [
                {
                    stage: 'Primary',
                    temp: '18',
                    days: '14'
                },
                {
                    stage: 'Secondary',
                    temp: '18',
                    days: '14'
                }
            ],
            fermDays: 28,
            water: {
                source: 'tap',
                adjustments: true,
                adjustmentNotes: '1g CaSO4/G of water.',
                expectedBoilOff: '4',
                preBoilVolume: '27',
                expectedAbsorption: '3.96',
                totalMashWater: '30.96',
                strikeWaterVol: '15.56',
                mashOutWaterVol: '5.36',
                spargeWaterVol: '9.64',
                grainTemp: '21',
                strikeWaterTemp: '74',
                spargeWaterTemp: '100',

            },
            mash: {
                method: 'Infusion',
                gristRatio: '4',
                absorptionLKg: '1.02',
                schedule: [
                    {
                        step: '1',
                        restType: 'Conversion',
                        temp: '68',
                        minutes: '60'
                    },
                    {
                        step: '2',
                        restType: 'Second Step',
                        temp: '75',
                        minutes: '30'
                    }
                ],
                totalMashMinutes: 90,
                mashOut: true,
                mashOutWaterTemp: '77',
                spargeMethod: 'Fly',
                spargeWaterTemp: '77'
            },
            finings: [
                {
                    name: 'Irish Moss',
                    qty: '1 tsp',
                    timing: 'Boil final 10'
                },
                {
                    name: 'Gelatin',
                    qty: '1 cup',
                    timing: 'End Secondary'
                }
            ],
            brews: ['1']
        }
        
    }
]

const brews = [
    {
        id: '1',
        beer: '1',
        recipe: '1',
        brewDate: 'Monday, May 18th 2020',
        daysRemaining: 20,
        gravityChecks: [
            {
                date: '17 June 2020',
                sg: 1.012, 
                attenuation: 73,
                abv: 5.8
            },
            {
                date: '10 June 2020',
                sg: 1.013, 
                attenuation: 72,
                abv: 5.7
            },
            {
                date: '3 June 2020',
                sg: 1.017, 
                attenuation: 69,
                abv: 5.5
            },
            {
                date: '18 May 2020',
                sg: 1.055, 
                attenuation: null,
                abv: null
            }
        ],
        nextSteps: [
            {
                date: '3 May 2020', 
                description: 'Fermentation Schedule 2: 12C for 3 Days'
            },
            {
                date: '6 May 2020', 
                description: 'Fermentation Schedule 3: 18C for 5 Days'
            },
            {
                date: '11 May 2020', 
                description: 'Fermentation Schedule 4: 4C for 28 Days'
            }
        ],
        notes: ['1', '2', '3', '4', '5']
    }
]

const notes = [
    {
        id: '1',
        brew: '1',
        title: 'Bottling Day',
        date: 'Tuesday, October 2nd 2018',
        content: 'At bottling, tasted great! Awesome hop smell and taste. Bigger dose of Cascade for dry hopping was definitely the way to go.',
        imgs: [
            {
                imgUrl: 'https://res.cloudinary.com/andycampbelldev/image/upload/v1538451686/lbkfki6rgjybn2qjlumf.jpg'
            }
        ]
    },
    {
        id: '2',
        brew: '1',
        title: 'Taste Notes',
        date: 'Tuesday, October 2nd 2018',
        content: `Opened first 330mL bottle 11 days after bottling. Bottle was refrigerated for one night prior. Could use a little more carbonation, but tastes excellent. Normally I'd consider a beer very green after less than 2 weeks in the bottle, but this one is lovely. I'd say the hop flavor and aroma is perfect - not overbearing. Very pleasant lingering grapefruit-like bitterness. Very happy with this batch so far.`,
        imgUrl: 'https://res.cloudinary.com/andycampbelldev/image/upload/v1538451732/pe0slb3fgyn7h057qqyz.jpg'
    },
    {
        id: '3',
        brew: '1',
        title: 'Bottle Conditioning',
        date: 'Tuesday, October 2nd 2018',
        content: 'Quick pic of the bottles going into the fridge.',
        imgUrl: 'https://res.cloudinary.com/andycampbelldev/image/upload/v1538455209/mhactawwqozvyeizj0bz.jpg'
    },
    {
        id: '4',
        brew: '1',
        title: 'Note without a Photo!',
        date: 'Tuesday, October 2nd 2018',
        content: 'Here is a note without a photo!'
    },
    {
        id: '5',
        brew: '1',
        title: 'Bach Brewing While Bottling!',
        date: 'Tuesday, October 2nd 2018',
        content: 'Sampling this one while I bottle my own!',
        imgUrl: 'https://res.cloudinary.com/andycampbelldev/image/upload/v1538465466/itmlfulxbhfcyus0o6b7.jpg'
    }
]

module.exports.beers = beers;
module.exports.recipes = recipes;
module.exports.brews = brews;
module.exports.notes = notes;