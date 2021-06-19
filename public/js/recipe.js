// --------------------------
// TO DO
// - separate out water calculation logic into separate script
// - general refactor - abstract calculation functions as much as possible and add to recipe object as methods.
// --------------------------

// calculations
// when certain fields change, we'll need to be prepared to update/recalculate other fields.
// There is going to be a lot to keep track of. We'll use an object called recipe to capture
//  values as they change, and call functions as necessary.

let recipe = {
  inputs: {},
  outputs: {}
}

// sum all values from all inputs matching the css selector passed in - ultimately an argument for querySelectorAll()
recipe.sumValues = function(c) {
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
recipe.getFloat = function(c) {
  return parseFloat(document.querySelector(c).value || 0);
}

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

// add all recipe related inputs  to the recipe object
recipe.getInputs = async function() {
  //water related
  this.inputs.batchSize = this.getFloat('#batchSize');
  this.inputs.boilMinutes = this.getFloat('#boilMinutes');
  this.inputs.boilOffRate = this.getFloat('#boilOffRate');
  this.inputs.grainAbsorptionRate = this.getFloat('#grainAbsorptionRate');
  this.inputs.gristRatio = this.getFloat('#gristRatio');
  this.inputs.kettleLoss = this.getFloat('#kettleLoss');
  this.inputs.targetABV = this.getFloat('#targetABV');
  this.inputs.targetFG = this.getFloat('#targetFG');
  this.inputs.targetOG = this.getFloat('#targetOG');
  this.inputs.maltQtyTotal = this.getFloat('#maltTotalsQtyInput');
  this.inputs.mashOutTargetTemp = this.getFloat('#mashOutTargetTemp');
  this.inputs.mashOutWaterTemp = this.getFloat('#mashOutWaterTemp');
  this.inputs.mashHeatLoss = this.getFloat('#mashHeatLoss');
  this.inputs.grainSpecificHeat = this.getFloat('#grainSpecificHeat');
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

}

recipe.calculateWater = async function() {
  await this.getInputs();
  this.outputs.boilOffVolume = parseFloat((this.inputs.boilOffRate * (this.inputs.boilMinutes/60)).toFixed(2));
  this.outputs.preBoilVolume = parseFloat((this.inputs.batchSize + this.inputs.kettleLoss + this.outputs.boilOffVolume).toFixed(2));
  this.outputs.grainAbsorptionVolume = parseFloat((this.inputs.maltQtyTotal * this.inputs.grainAbsorptionRate).toFixed(2));
  this.outputs.totalMashWaterVolume = parseFloat((this.outputs.preBoilVolume + this.outputs.grainAbsorptionVolume).toFixed(2));
  this.outputs.strikeWaterVolume = parseFloat((this.inputs.gristRatio * this.inputs.maltQtyTotal).toFixed(2));
  if(this.inputs.mashOut) {
    this.outputs.mashEndTemp = parseFloat((this.inputs.finalMashStepTemp - ((this.inputs.finalMashStepMinutes/60) * this.inputs.mashHeatLoss)).toFixed(2));
    this.outputs.mashOutVolume = parseFloat(((this.inputs.mashOutTargetTemp - this.outputs.mashEndTemp) * ((this.inputs.maltQtyTotal * this.inputs.grainSpecificHeat) + this.outputs.strikeWaterVolume)/(this.inputs.mashOutWaterTemp - this.inputs.mashOutTargetTemp)).toFixed(2));
  } else {
    this.outputs.mashOutVolume = 0;
  }
  this.outputs.spargeWaterVolume = parseFloat((this.outputs.totalMashWaterVolume - (this.outputs.strikeWaterVolume + this.outputs.mashOutVolume)).toFixed(2));
  recipe.outputWater(); // output water results to the DOM
}

recipe.outputWater = function() {
  //show batch size
  document.querySelector('#water-table-display-batchSize span').textContent = this.inputs.batchSize;
  //show kettle loss
  document.querySelector('#water-table-display-kettleLoss span').textContent = this.inputs.kettleLoss;
  //boil-off inputs and result
  document.querySelector('#water-table-input-boilOff').value = this.outputs.boilOffVolume;
  document.querySelector('#water-table-display-boilOff span').textContent = this.outputs.boilOffVolume;
  document.querySelector('#water-table-display-boilOff').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Brewhouse Boil-Off L/hour x (Recipe Boil Minutes / 60 )</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.boilOffRate}</span> x (<span class='bold'>${this.inputs.boilMinutes}</span> / 60)</span>
  <span class='text-lite italic d-block'>= ${this.outputs.boilOffVolume} L</span>
  `)
  //pre boil volume inputs and result
  document.querySelector('#water-table-input-preBoilVolume').value = this.outputs.preBoilVolume;
  document.querySelector('#water-table-display-preBoilVolume span').textContent = this.outputs.preBoilVolume;
  document.querySelector('#water-table-display-preBoilVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Recipe Batch Size + Brewhouse Kettle Loss + Calculated Boil-Off</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.batchSize}</span> + <span class='bold'>${this.inputs.kettleLoss}</span> + <span class='bold'>${this.outputs.boilOffVolume}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.preBoilVolume} L</span>
  `)
  if(this.outputs.preBoilVolume) {
    //document.querySelector('#malts-preBoilVolume').classList.remove('d-none');
    document.querySelector('#malts-preBoilVolume').innerHTML = `Total Gravity Points based on Pre-Boil Volume of <span class='bold'>${this.outputs.preBoilVolume}</span> L`
  }
  //grain absorption inputs and result
  document.querySelector('#water-table-input-grainAbsorptionVolume').value = this.outputs.grainAbsorptionVolume;
  document.querySelector('#water-table-display-grainAbsorptionVolume span').textContent = this.outputs.grainAbsorptionVolume;
  document.querySelector('#water-table-display-grainAbsorptionVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Recipe Grain Absorption Rate L/kg x Recipe Total Malt Weight kg</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.grainAbsorptionRate}</span> x <span class='bold'>${this.inputs.maltQtyTotal}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.grainAbsorptionVolume} L</span>
  `);
  //total water inputs and result
  document.querySelector('#water-table-input-totalMashWaterVolume').value = this.outputs.totalMashWaterVolume;
  document.querySelector('#water-table-display-totalMashWaterVolume span').textContent = this.outputs.totalMashWaterVolume;
  document.querySelector('#water-table-display-totalMashWaterVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Calculated Pre-Boil Volume L + Calculated Grain Absorption L</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.outputs.preBoilVolume}</span> + <span class='bold'>${this.outputs.grainAbsorptionVolume}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.totalMashWaterVolume} L</span>
  `);
  //strike water inputs and result
  document.querySelector('#water-table-input-strikeWaterVolume').value = this.outputs.strikeWaterVolume;
  document.querySelector('#water-table-display-strikeWaterVolume span').textContent = this.outputs.strikeWaterVolume;
  document.querySelector('#water-table-display-strikeWaterVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Brewhouse Grist Ratio L/kg x Receipe Total Malt Weight kg</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.inputs.gristRatio}</span> x <span class='bold'>${this.inputs.maltQtyTotal}</span></span>
  <span class='text-lite italic d-block'>= ${this.outputs.strikeWaterVolume} L</span>
  `);
  //mash out volume inputs and result
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
  //sparge volume inputs and result
  document.querySelector('#water-table-input-spargeWaterVolume').value = this.outputs.spargeWaterVolume;
  document.querySelector('#water-table-display-spargeWaterVolume span').textContent = this.outputs.spargeWaterVolume;
  document.querySelector('#water-table-display-spargeWaterVolume').setAttribute('data-content', `
  <span class='text-lite italic d-block'>Calculated Total Mash Water L - (Calculated Strike Water L + Calculated Mash Out Water L)</span>
  <span class='text-lite italic d-block'>= <span class='bold'>${this.outputs.totalMashWaterVolume}</span> - (<span class='bold'>${this.outputs.strikeWaterVolume}</span> + <span class='bold'>${this.outputs.mashOutVolume}</span>)</span>
  <span class='text-lite italic d-block'>= ${this.outputs.spargeWaterVolume} L</span>
  `)
}

// malt row calculator - calculate Points, MCU and SRM for a specific malt, and update the malt table totals
recipe.calculateMaltRow = async function(row) {
  // calculate points for each malt
  const qty = parseFloat(row.querySelector('input[id^="maltQty"]').value || 0);
  const ppg = parseFloat(row.querySelector('input[id^="maltPPG"]').value || 0);
  // now we have the metric qty and pre boil volume, but the ppg is imperial.
  // convert ppg value to a metric value by multiplying by 8.3454
  const points = parseFloat(((ppg * 8.3454) * qty / recipe.outputs.preBoilVolume).toFixed(0));
  row.querySelector('input[id^="maltGravityPointsInput"]').value = points;
  row.querySelector('span[id^="maltGravityPointsDisplay"]').textContent = points;
  // calculate MCU
  const lovibond = row.querySelector('input[id^="maltLovibond"]').value;
  const mcu = parseFloat(((lovibond * 8.3454) * qty / recipe.inputs.batchSize).toFixed(2));
  row.querySelector('input[id^="maltMCUInput"]').value = mcu;
  row.querySelector('span[id^="maltMCUDisplay"]').textContent = mcu;
  // calculate Morey SRM
  const srm = parseFloat((1.4922 * (mcu ** 0.6859)).toFixed(2));
  row.querySelector('input[id^="maltSRMInput\\["]').value = srm;
  row.querySelector('span[id^="maltSRMDisplay"]').textContent = srm;
  // column operations
  // add up all gravity points
  const totalGravityPoints = recipe.sumValues('input[id^="maltGravityPoints"]');
  document.querySelector('#maltTotalsPointsDisplay').textContent = totalGravityPoints;
  document.querySelector('#maltTotalsPointsInput').value = totalGravityPoints;
  const expectedPreBoilGravity = parseFloat((totalGravityPoints * (recipe.inputs.conversionPercent/100)).toFixed(0))
  document.querySelector('#malts-expectedPreBoilGravity').textContent = expectedPreBoilGravity;
  // add up malt qty
  const totalMaltQty = parseFloat((recipe.sumValues('input[id^="maltQty\\["]').toFixed(3)));
  document.querySelector('#maltTotalsQtyDisplay').textContent = totalMaltQty;
  document.querySelector('#maltTotalsQtyInput').value = totalMaltQty;
  // add up MCU
  const totalMaltMCU = parseFloat((recipe.sumValues('input[id^="maltMCUInput\\["]').toFixed(2)));
  document.querySelector('#maltTotalsMCUDisplay').textContent = totalMaltMCU;
  document.querySelector('#maltTotalsMCUInput').value = totalMaltMCU;
  // calculate SRM based on total MCU
  const totalMaltSRM = parseFloat((1.4922 * (totalMaltMCU ** 0.6859)).toFixed(2))
  const srmHex = totalMaltSRM ? recipe.getSrmHex(totalMaltSRM) : '#FFFFFF'
  document.querySelector('#maltTotalsSRMDisplay').textContent = totalMaltSRM;
  document.querySelector('#maltTotalsSRMInput').value = totalMaltSRM;
  document.querySelector('#maltTotalsSRMInput').parentElement.style.backgroundColor = srmHex;
}

// return malt color hex code
recipe.getSrmHex = function (n) {
  const colors = [{hex: "#FFE699", srm: "1"},{hex: "#FFD878", srm: "2"},{hex: "#FFCA5A", srm: "3"},{hex: "#FFBF42", srm: "4"},{hex: "#FBB123", srm: "5"},{hex: "#F8A600", srm: "6"},{hex: "#F39C00", srm: "7"},{hex: "#EA8F00", srm: "8"},{hex: "#E58500", srm: "9"},{hex: "#DE7C00", srm: "10"},{hex: "#D77200", srm: "11"},{hex: "#CF6900", srm: "12"},{hex: "#CB6200", srm: "13"},{hex: "#C35900", srm: "14"},{hex: "#BB5100", srm: "15"},{hex: "#B54C00", srm: "16"},{hex: "#B04500", srm: "17"},{hex: "#A63E00", srm: "18"},{hex: "#A13700", srm: "19"},{hex: "#9B3200", srm: "20"},{hex: "#952D00", srm: "21"},{hex: "#8E2900", srm: "22"},{hex: "#882300", srm: "23"},{hex: "#821E00", srm: "24"},{hex: "#7B1A00", srm: "25"},{hex: "#771900", srm: "26"},{hex: "#701400", srm: "27"},{hex: "#6A0E00", srm: "28"},{hex: "#660D00", srm: "29"},{hex: "#5E0B00", srm: "30"},{hex: "#5A0A02", srm: "31"},{hex: "#600903", srm: "32"},{hex: "#520907", srm: "33"},{hex: "#4C0505", srm: "34"},{hex: "#470606", srm: "35"},{hex: "#440607", srm: "36"},{hex: "#3F0708", srm: "37"},{hex: "#3B0607", srm: "38"},{hex: "#3A070B", srm: "39"},{hex: "#36080A", srm: "40"}]
  const { hex } = colors.filter(color => color.srm == Math.floor(n))[0];
  return hex;
}

// listen for inputs on the malt table and calculate the effected malt row, update malt totals and update water
document.querySelector('#malt-table-container').addEventListener('input', async (e) => {
  const maltRow = e.target.parentElement.parentElement;
  await recipe.calculateMaltRow(maltRow);
  recipe.calculateWater(); //run water calculator as aspects of water may change based on total malts.
})
// targets - on input, capture values on recipe object
document.querySelector('#target-container').addEventListener('input', (e) => {
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

// malt table - listen for changes

// mash table - listen for changes
document.querySelector('#mash-table-container').addEventListener('input', (e) => {
  //run water calculator
  recipe.calculateWater();
})

// listen on any fields related to water calculation. Whenever any of these change, update the water calcs.

// batch size
// boil length

// changes in any field on a given malt 
// - run all malt functions - e.g color  
// - update malt totals

// changes in any field on a given hop
// - run all hop functions
// - update hop totals

