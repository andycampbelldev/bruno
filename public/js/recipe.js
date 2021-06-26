// --------------------------
// TO DO
// --------------------------

// Continue experimenting with Malt Class and determine if this would be a cleaner approach than the current maltRow calculator.

// Decide whether we should use the recipe inputs object for all calculation values, or just totals
  // e.g. for individual malt rows, it's easier to just pull the required values straight from the DOM and store as variables,
    // but this is a different approach to how we handle water, where we capture all the inputs and save them on the recipe object's inputs property
// Continue refactor

// store inputs, outputs and calculator methods on recipe object.

let recipe = {
  inputs: {},
  outputs: {},
  calculators: {}
}

//class for malts
class Malt {
  constructor(qty, ppg, lovibond) {
    this.qty = qty;
    this.ppg = ppg;
    this.lovibond = lovibond;
    //this.recipe = recipe;
  }
  maltPoints = function() {
    const { qty, ppg } = this;
    return parseFloat(((ppg * 8.3454) * qty / recipe.outputs.preBoilVolume).toFixed(0)); // convert ppg value to a metric value by multiplying by 8.3454
  }
  maltMcu = function() {
    const { lovibond, qty } = this;
    return parseFloat(((lovibond * 8.3454) * qty / recipe.inputs.batchSize).toFixed(2)); // convert lovibond value to a metric value by multiplying by 8.3454
  }
  maltSrm = function() {
    const mcu = this.maltMcu();
    return parseFloat((1.4922 * (mcu ** 0.6859)).toFixed(2)); // Morey SRM
  }
  // expectedGravity = function(totalPoints, conversionPercent) {
  //   return parseFloat((totalPoints * (conversionPercent/100)).toFixed(0))
  // }
  // srmHex = function (n) {
  //   const colors = [{hex: "#FFE699", srm: "1"},{hex: "#FFD878", srm: "2"},{hex: "#FFCA5A", srm: "3"},{hex: "#FFBF42", srm: "4"},{hex: "#FBB123", srm: "5"},{hex: "#F8A600", srm: "6"},{hex: "#F39C00", srm: "7"},{hex: "#EA8F00", srm: "8"},{hex: "#E58500", srm: "9"},{hex: "#DE7C00", srm: "10"},{hex: "#D77200", srm: "11"},{hex: "#CF6900", srm: "12"},{hex: "#CB6200", srm: "13"},{hex: "#C35900", srm: "14"},{hex: "#BB5100", srm: "15"},{hex: "#B54C00", srm: "16"},{hex: "#B04500", srm: "17"},{hex: "#A63E00", srm: "18"},{hex: "#A13700", srm: "19"},{hex: "#9B3200", srm: "20"},{hex: "#952D00", srm: "21"},{hex: "#8E2900", srm: "22"},{hex: "#882300", srm: "23"},{hex: "#821E00", srm: "24"},{hex: "#7B1A00", srm: "25"},{hex: "#771900", srm: "26"},{hex: "#701400", srm: "27"},{hex: "#6A0E00", srm: "28"},{hex: "#660D00", srm: "29"},{hex: "#5E0B00", srm: "30"},{hex: "#5A0A02", srm: "31"},{hex: "#600903", srm: "32"},{hex: "#520907", srm: "33"},{hex: "#4C0505", srm: "34"},{hex: "#470606", srm: "35"},{hex: "#440607", srm: "36"},{hex: "#3F0708", srm: "37"},{hex: "#3B0607", srm: "38"},{hex: "#3A070B", srm: "39"},{hex: "#36080A", srm: "40"}]
  //   const { hex } = colors.filter(color => color.srm == Math.floor(n))[0];
  //   return hex;
  // }
}

// sum all values from all inputs matching the css selector passed in - ultimately an argument for querySelectorAll()
const sumValues = function(c) {
  let total = 0
  const inputs = document.querySelectorAll(c);
  for (let input of inputs) {
    if (input.value) {
      total += parseFloat(input.value);
    }
  }
  return total;
}

// get current value or 0 from the specific input matching the css selector passed in - ultimately used with querySelector
const getFloat = function(cssSelector, domNode = document) {
  return parseFloat(domNode.querySelector(cssSelector).value || 0);
}

// add all recipe related inputs  to the recipe object
recipe.getInputs = async function() {
  //water related
  this.inputs.batchSize = getFloat('#batchSize');
  this.inputs.boilMinutes = getFloat('#boilMinutes');
  this.inputs.boilOffRate = getFloat('#boilOffRate');
  this.inputs.grainAbsorptionRate = getFloat('#grainAbsorptionRate');
  this.inputs.gristRatio = getFloat('#gristRatio');
  this.inputs.kettleLoss = getFloat('#kettleLoss');
  this.inputs.targetABV = getFloat('#targetABV');
  this.inputs.targetFG = getFloat('#targetFG');
  this.inputs.targetOG = getFloat('#targetOG');
  this.inputs.maltQtyTotal = getFloat('#maltTotalsQtyInput');
  this.inputs.mashOutTargetTemp = getFloat('#mashOutTargetTemp');
  this.inputs.mashOutWaterTemp = getFloat('#mashOutWaterTemp');
  this.inputs.mashHeatLoss = getFloat('#mashHeatLoss');
  this.inputs.grainSpecificHeat = getFloat('#grainSpecificHeat');
  let mashOut = document.querySelectorAll(`[name^='water[mashOut\\]']`);
  for (let i of mashOut) {
    if(i.checked === true) {
      this.inputs.mashOut = (i.value === 'true' ? true : false);
    };
  }
  // mash out: we need to know the last mash step temp and duration
  const mashStepTemps = document.querySelectorAll('input[id^="mashTemp"]');
  const mashStepMins = document.querySelectorAll('input[id^="mashMins"]');
  this.inputs.finalMashStepTemp = parseFloat(mashStepTemps[mashStepTemps.length-1].value || 0);
  this.inputs.finalMashStepMinutes = parseFloat(mashStepMins[mashStepMins.length-1].value || 0);
  // malt related inputs
  
  // maltQtyTotal gathered for water

}

// water methods

recipe.calculators.boilOffVolume = async function() {
  return parseFloat((recipe.inputs.boilOffRate * (recipe.inputs.boilMinutes/60)).toFixed(2));
}

recipe.calculators.preBoilVolume = async function() {
  return parseFloat((recipe.inputs.batchSize + recipe.inputs.kettleLoss + recipe.outputs.boilOffVolume).toFixed(2));
}

recipe.calculators.grainAbsorptionVolume = async function() {
  return parseFloat((recipe.inputs.maltQtyTotal * recipe.inputs.grainAbsorptionRate).toFixed(2));
}

recipe.calculators.totalMashWaterVolume = async function() {
  return parseFloat((recipe.outputs.preBoilVolume + recipe.outputs.grainAbsorptionVolume).toFixed(2));
}

recipe.calculators.strikeWaterVolume = async function() {
  return parseFloat((recipe.inputs.gristRatio * recipe.inputs.maltQtyTotal).toFixed(2));
}

recipe.calculators.mashEndTemp = async function() {
  return parseFloat((recipe.inputs.finalMashStepTemp - ((recipe.inputs.finalMashStepMinutes/60) * recipe.inputs.mashHeatLoss)).toFixed(2));
}

recipe.calculators.mashOutVolume = async function() {
  return recipe.inputs.mashOut ? parseFloat(((recipe.inputs.mashOutTargetTemp - recipe.outputs.mashEndTemp) * ((recipe.inputs.maltQtyTotal * recipe.inputs.grainSpecificHeat) + recipe.outputs.strikeWaterVolume)/(recipe.inputs.mashOutWaterTemp - recipe.inputs.mashOutTargetTemp)).toFixed(2)) : 0;
}

recipe.calculators.spargeWaterVolume = async function() {
  return parseFloat((recipe.outputs.totalMashWaterVolume - (recipe.outputs.strikeWaterVolume + recipe.outputs.mashOutVolume)).toFixed(2));
}

// malt methods
recipe.calculators.maltPoints = async function(qty, ppg, preBoilVol) {
  return parseFloat(((ppg * 8.3454) * qty / preBoilVol).toFixed(0)); // convert ppg value to a metric value by multiplying by 8.3454
}

recipe.calculators.maltMcu = async function(lovibond, qty, batchSize ) {
  return parseFloat(((lovibond * 8.3454) * qty / batchSize).toFixed(2)); // convert lovibond value to a metric value by multiplying by 8.3454
}

recipe.calculators.maltSrm = async function(mcu) {
  return parseFloat((1.4922 * (mcu ** 0.6859)).toFixed(2)); // Morey SRM
}

recipe.calculators.expectedGravity = async function(totalPoints, conversionPercent) {
  return parseFloat((totalPoints * (conversionPercent/100)).toFixed(0))
}

recipe.calculators.srmHex = function (n) {
  const colors = [{hex: "#FFE699", srm: "1"},{hex: "#FFD878", srm: "2"},{hex: "#FFCA5A", srm: "3"},{hex: "#FFBF42", srm: "4"},{hex: "#FBB123", srm: "5"},{hex: "#F8A600", srm: "6"},{hex: "#F39C00", srm: "7"},{hex: "#EA8F00", srm: "8"},{hex: "#E58500", srm: "9"},{hex: "#DE7C00", srm: "10"},{hex: "#D77200", srm: "11"},{hex: "#CF6900", srm: "12"},{hex: "#CB6200", srm: "13"},{hex: "#C35900", srm: "14"},{hex: "#BB5100", srm: "15"},{hex: "#B54C00", srm: "16"},{hex: "#B04500", srm: "17"},{hex: "#A63E00", srm: "18"},{hex: "#A13700", srm: "19"},{hex: "#9B3200", srm: "20"},{hex: "#952D00", srm: "21"},{hex: "#8E2900", srm: "22"},{hex: "#882300", srm: "23"},{hex: "#821E00", srm: "24"},{hex: "#7B1A00", srm: "25"},{hex: "#771900", srm: "26"},{hex: "#701400", srm: "27"},{hex: "#6A0E00", srm: "28"},{hex: "#660D00", srm: "29"},{hex: "#5E0B00", srm: "30"},{hex: "#5A0A02", srm: "31"},{hex: "#600903", srm: "32"},{hex: "#520907", srm: "33"},{hex: "#4C0505", srm: "34"},{hex: "#470606", srm: "35"},{hex: "#440607", srm: "36"},{hex: "#3F0708", srm: "37"},{hex: "#3B0607", srm: "38"},{hex: "#3A070B", srm: "39"},{hex: "#36080A", srm: "40"}]
  const { hex } = colors.filter(color => color.srm == Math.floor(n))[0];
  return hex;
}

recipe.calculateWater = async function() {
  // get all inputs
  await this.getInputs();
  // run calcs
  this.outputs.boilOffVolume = await this.calculators.boilOffVolume();
  this.outputs.preBoilVolume = await this.calculators.preBoilVolume();
  this.outputs.grainAbsorptionVolume = await this.calculators.grainAbsorptionVolume();
  this.outputs.totalMashWaterVolume = await this.calculators.totalMashWaterVolume();
  this.outputs.strikeWaterVolume = await this.calculators.strikeWaterVolume();
  this.outputs.mashEndTemp = await this.calculators.mashEndTemp();
  this.outputs.mashOutVolume = await this.calculators.mashOutVolume();
  this.outputs.spargeWaterVolume = await this.calculators.spargeWaterVolume();
  // output water results to the DOM
  document.querySelector('#water-table-display-batchSize span').textContent = this.inputs.batchSize;
  document.querySelector('#water-table-display-kettleLoss span').textContent = this.inputs.kettleLoss;
  document.querySelector('#water-table-input-boilOff').value = this.outputs.boilOffVolume;
  document.querySelector('#water-table-display-boilOff span').textContent = this.outputs.boilOffVolume;
  document.querySelector('#water-table-display-boilOff').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Brewhouse Boil-Off L/hour x (Recipe Boil Minutes / 60 )</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.boilOffRate}</span> x (<span class='bold'>${this.inputs.boilMinutes}</span> / 60)</span>
  <span class='text-lite italic d-block'>= ${this.outputs.boilOffVolume} L</span>
  `)
  document.querySelector('#water-table-input-preBoilVolume').value = this.outputs.preBoilVolume;
  document.querySelector('#water-table-display-preBoilVolume span').textContent = this.outputs.preBoilVolume;
  document.querySelector('#water-table-display-preBoilVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Recipe Batch Size + Brewhouse Kettle Loss + Calculated Boil-Off</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.batchSize}</span> + <span class='bold'>${this.inputs.kettleLoss}</span> + <span class='bold'>${this.outputs.boilOffVolume}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.preBoilVolume} L</span>
  `)
  if(this.outputs.preBoilVolume) {
    document.querySelector('#malts-preBoilVolume').innerHTML = `Total Gravity Points based on Pre-Boil Volume of <span class='bold'>${this.outputs.preBoilVolume}</span> L`
  }
  document.querySelector('#water-table-input-grainAbsorptionVolume').value = this.outputs.grainAbsorptionVolume;
  document.querySelector('#water-table-display-grainAbsorptionVolume span').textContent = this.outputs.grainAbsorptionVolume;
  document.querySelector('#water-table-display-grainAbsorptionVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Recipe Grain Absorption Rate L/kg x Recipe Total Malt Weight kg</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.grainAbsorptionRate}</span> x <span class='bold'>${this.inputs.maltQtyTotal}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.grainAbsorptionVolume} L</span>
  `);
  document.querySelector('#water-table-input-totalMashWaterVolume').value = this.outputs.totalMashWaterVolume;
  document.querySelector('#water-table-display-totalMashWaterVolume span').textContent = this.outputs.totalMashWaterVolume;
  document.querySelector('#water-table-display-totalMashWaterVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Calculated Pre-Boil Volume L + Calculated Grain Absorption L</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.outputs.preBoilVolume}</span> + <span class='bold'>${this.outputs.grainAbsorptionVolume}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.totalMashWaterVolume} L</span>
  `);
  document.querySelector('#water-table-input-strikeWaterVolume').value = this.outputs.strikeWaterVolume;
  document.querySelector('#water-table-display-strikeWaterVolume span').textContent = this.outputs.strikeWaterVolume;
  document.querySelector('#water-table-display-strikeWaterVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Brewhouse Grist Ratio L/kg x Receipe Total Malt Weight kg</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.gristRatio}</span> x <span class='bold'>${this.inputs.maltQtyTotal}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.strikeWaterVolume} L</span>
  `);
  document.querySelector('#water-table-input-mashOutVolume').value = this.outputs.mashOutVolume;
  document.querySelector('#water-table-display-mashOutVolume span').textContent = this.outputs.mashOutVolume;
  document.querySelector('#water-table-display-mashOutVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>(T2-T1) x (G + Wm) / (Tw – T2)</span>
  <span class='text-lite italic d-block mb-1'>
    ${this.inputs.mashOut ? '= (<span class="bold">' + this.inputs.mashOutTargetTemp + '</span> - <span class="bold">' + this.outputs.mashEndTemp + '</span>) x ((<span class="bold">' + this.inputs.maltQtyTotal + '</span> x <span class="bold">' + this.inputs.grainSpecificHeat + '</span>) + <span class="bold">' + this.outputs.strikeWaterVolume + '</span>) / (<span class="bold">' + this.inputs.mashOutWaterTemp + '</span> – <span class="bold">' + this.inputs.mashOutTargetTemp + '</span>)' : ''}
  </span>
  <span class='text-lite italic d-block mb-1'>
    = ${this.outputs.mashOutVolume} L ${this.inputs.mashOut ? '' : '(No Mash Out on this Recipe)'}
  </span>
  <hr>
  <span class='text-lite italic d-block'><span class='bold'>T2</span> = Brewhouse Mash Out Target Temp C</span>
  <span class='text-lite italic d-block'><span class='bold'>T1</span> = Calculated Mash End Temp C (Recipe Mash Temp C, Recipe Mash Length minutes, and Brewhouse Mash Tun Heat Loss C/hour)</span>
  <span class='text-lite italic d-block'><span class='bold'>G</span> = Recipe Total Malt Weight x Brewhouse Grain Specific Heat</span>
  <span class='text-lite italic d-block'><span class='bold'>Wm</span> = Calculated Strike Water Volume L</span>
  <span class='text-lite italic d-block'><span class='bold'>Tw</span> = Brewhouse Mash Out Water Temp C</span>
  `);
  document.querySelector('#water-table-input-spargeWaterVolume').value = this.outputs.spargeWaterVolume;
  document.querySelector('#water-table-display-spargeWaterVolume span').textContent = this.outputs.spargeWaterVolume;
  document.querySelector('#water-table-display-spargeWaterVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Calculated Total Mash Water L - (Calculated Strike Water L + Calculated Mash Out Water L)</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.outputs.totalMashWaterVolume}</span> - (<span class='bold'>${this.outputs.strikeWaterVolume}</span> + <span class='bold'>${this.outputs.mashOutVolume}</span>)</span>
  <span class='text-lite italic d-block'>= ${this.outputs.spargeWaterVolume} L</span>
  `)
}

// malt row calculator - calculate Points, MCU and SRM for a specific malt, and update the malt table totals
recipe.calculators.maltRow = async function(row) {
  //collect row inputs
  const qty = getFloat('input[id^="maltQty"]', row);
  const ppg = getFloat('input[id^="maltPPG"]', row);
  const lovibond = getFloat('input[id^="maltLovibond"]', row);
  //run row calcs
  const points = await recipe.calculators.maltPoints(qty, ppg, recipe.outputs.preBoilVolume);
  const mcu = await recipe.calculators.maltMcu(lovibond, qty, recipe.inputs.batchSize);
  const srm = await recipe.calculators.maltSrm(mcu);
  //output to DOM
  row.querySelector('input[id^="maltGravityPointsInput"]').value = points;
  row.querySelector('span[id^="maltGravityPointsDisplay"]').textContent = points;
  row.querySelector('input[id^="maltMCUInput"]').value = mcu;
  row.querySelector('span[id^="maltMCUDisplay"]').textContent = mcu;
  row.querySelector('input[id^="maltSRMInput\\["]').value = srm;
  row.querySelector('span[id^="maltSRMDisplay"]').textContent = srm;
}

recipe.calculators.maltTotals = async function() {
  //collect inputs
  const totalMaltQty = parseFloat((sumValues('input[id^="maltQty\\["]').toFixed(3)));
  const totalGravityPoints = sumValues('input[id^="maltGravityPoints"]');
  const totalMaltMCU = parseFloat((sumValues('input[id^="maltMCUInput\\["]').toFixed(2)));
  //run calcs
  const expectedPreBoilGravity = await recipe.calculators.expectedGravity(totalGravityPoints, recipe.inputs.conversionPercent);
  const totalMaltSRM = await recipe.calculators.maltSrm(totalMaltMCU);
  const srmHex = totalMaltSRM ? recipe.calculators.srmHex(totalMaltSRM) : '#FFFFFF'
  //output to DOM
  document.querySelector('#maltTotalsQtyDisplay').textContent = totalMaltQty;
  document.querySelector('#maltTotalsQtyInput').value = totalMaltQty;
  document.querySelector('#maltTotalsPointsDisplay').textContent = totalGravityPoints;
  document.querySelector('#maltTotalsPointsInput').value = totalGravityPoints;
  document.querySelector('#maltTotalsMCUDisplay').textContent = totalMaltMCU;
  document.querySelector('#maltTotalsMCUInput').value = totalMaltMCU;
  document.querySelector('#maltTotalsSRMDisplay').textContent = totalMaltSRM;
  document.querySelector('#maltTotalsSRMInput').value = totalMaltSRM;
  document.querySelector('#maltTotalsSRMInput').parentElement.style.backgroundColor = srmHex;
  document.querySelector('#malts-expectedPreBoilGravity').textContent = expectedPreBoilGravity;
}

//EVENT LISTENERS


// listen for inputs on the malt table and calculate the effected malt row, update malt totals and update water
document.querySelector('#malt-table-container').addEventListener('input', async (e) => {
  const maltRow = e.target.parentElement.parentElement;
  await recipe.calculators.maltRow(maltRow);
  await recipe.calculators.maltTotals();
  recipe.calculateWater(); //run water calculator as aspects of water may change based on total malts.
})
// targets - on input, capture values on recipe object
document.querySelector('#target-container').addEventListener('input', (e) => {
   //run water calculator
   recipe.calculateWater();
})

// boil minutes - on input, capture value on recipe object
document.querySelector('#boilMinutes').addEventListener('input', (e) => {
  //run water calculator
  recipe.calculateWater();
})

// Brewhouse settings - on input, capture values on recipe object
document.querySelector('#brewhouse-container').addEventListener('input', (e) => {
   //run water calculator
   recipe.calculateWater();
})

// Mash Out Toggler - on change, run water calculator
// use of setTimeout() is a little janky. Bug in BS4 where radio buttons seem to be eating events on the underlying inputs.
// a click event on the parent element will cause the calc to run before the radios have been updated. A short delay resolves this.
document.querySelector('#mashOutToggle').addEventListener('click', () => {
  setTimeout(() => {
    recipe.calculateWater()
  }, 100);
})

// mash table - listen for changes
document.querySelector('#mash-table-container').addEventListener('input', (e) => {
  //run water calculator
  recipe.calculateWater();
})

// When the brewhouse select changes, populate recipe brewhouse volume/temp settings from selected brewhouse. Store the Brewhouse Mash Conversion Percent on the recipe object
$("#brewhouseSelect").change(function() {
  if($(this).val()) {
    $.get(`http://localhost:3000/brewhouses/${$(this).val()}`, function(data) {
      $("#boilOffRate").val(data.boilOffRate);
      $("#kettleLoss").val(data.kettleLoss);
      $("#grainAbsorptionRate").val(data.grainAbsorptionRate);
      $("#gristRatio").val(data.gristRatio);
      $("#mashOutTargetTemp").val(data.mashOutTargetTemp);
      $("#mashOutWaterTemp").val(data.mashOutWaterTemp);
      $("#mashHeatLoss").val(data.mashHeatLoss);
      $("#grainSpecificHeat").val(data.grainSpecificHeat);
      recipe.inputs.conversionPercent = data.conversionPercent;
      $("#malts-conversionPercent").text(data.conversionPercent);
       //run water calculator
      recipe.calculateWater();
    })
  }
});

