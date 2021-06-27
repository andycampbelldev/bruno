/* 
========TO DO==============
+ Update formControl event handlers to run calculator methods when rows are deleted.
+ Review use of input event for firing calculators - ensure this isn't too bad for performance.
+ refactor event listeners - try to find nicer way to listen on boil minutes so it doesn't have to have its own specific event listener.
  - consider adding a class to any inputs that need to fire specific methods on input.

===========================

Design Notes:

+ Create a recipe class with all the methods needed to update values on the recipe.
+ instantiate a new recipe object when the page loads
+ On each input event, 
  - pull in all the required values from the DOM
  - run all calculator methods
  - output values to the DOM

+ Have classes for each multi-instance recipe entity, like malts and hops.
+ Whenever there is input on one of these rows
  - instantiate a new object from the class
  - pull in all values from the row, and also from the recipe object
  - Run calculations
  - Output values to the DOM for the row level
  - Run total calculations - each time there's a change at the row level, the totals for the relevant entity should be updated.
  - Output all values again.
*/

class Recipe {
  constructor() {
    this.values = {}
  }
  refreshInputs = function() {
    this.values.batchSize = getFloat('#batchSize');
    this.values.boilMinutes = getFloat('#boilMinutes');
    this.values.boilOffRate = getFloat('#boilOffRate');
    this.values.grainAbsorptionRate = getFloat('#grainAbsorptionRate');
    this.values.gristRatio = getFloat('#gristRatio');
    this.values.kettleLoss = getFloat('#kettleLoss');
    this.values.targetABV = getFloat('#targetABV');
    this.values.targetFG = getFloat('#targetFG');
    this.values.targetOG = getFloat('#targetOG');
    this.values.maltQtyTotal = getFloat('#maltTotalsQtyInput');
    this.values.mashOutTargetTemp = getFloat('#mashOutTargetTemp');
    this.values.mashOutWaterTemp = getFloat('#mashOutWaterTemp');
    this.values.mashHeatLoss = getFloat('#mashHeatLoss');
    this.values.grainSpecificHeat = getFloat('#grainSpecificHeat');
    let mashOut = document.querySelectorAll(`[name^='water[mashOut\\]']`);
    for (let i of mashOut) {
      if (i.checked === true) {
        this.values.mashOut = (i.value === 'true' ? true : false);
      };
    }
    const mashStepTemps = document.querySelectorAll('input[id^="mashTemp"]');
    const mashStepMins = document.querySelectorAll('input[id^="mashMins"]');
    this.values.finalMashStepTemp = parseFloat(mashStepTemps[mashStepTemps.length - 1].value || 0);
    this.values.finalMashStepMinutes = parseFloat(mashStepMins[mashStepMins.length - 1].value || 0);
    this.values.conversionPercent = getFloat('#malts-conversionPercent');
    this.values.totalGravityPoints = getFloat('#maltTotalsPointsInput');
    this.values.totalMaltMCU = getFloat('#maltTotalsMCUInput');
    this.values.totalMaltSRM = getFloat('#maltTotalsSRMInput');
  }
  //water methods
  boilOffVolume = function() {
    const { boilOffRate, boilMinutes } = this.values;
    this.values.boilOffVolume = parseFloat((boilOffRate * (boilMinutes / 60)).toFixed(2));
    return this.values.boilOffVolume;
  }
  preBoilVolume = function() {
    const { batchSize, kettleLoss, boilOffVolume } = this.values;
    this.values.preBoilVolume = parseFloat((batchSize + kettleLoss + boilOffVolume).toFixed(2));
    return this.values.preBoilVolume;
  }
  grainAbsorptionVolume = function() {
    const { maltQtyTotal, grainAbsorptionRate } = this.values;
    this.values.grainAbsorptionVolume = parseFloat((maltQtyTotal * grainAbsorptionRate).toFixed(2));
    return this.values.grainAbsorptionVolume;
  }
  totalMashWaterVolume = function() {
    const { preBoilVolume, grainAbsorptionVolume } = this.values;
    this.values.totalMashWaterVolume = parseFloat((preBoilVolume + grainAbsorptionVolume).toFixed(2));
    return this.values.totalMashWaterVolume;
  }
  strikeWaterVolume = function() {
    const { gristRatio, maltQtyTotal } = this.values;  
    this.values.strikeWaterVolume = parseFloat((gristRatio * maltQtyTotal).toFixed(2));
    return this.values.strikeWaterVolume;
  }
  mashEndTemp = function() {
    const { finalMashStepTemp, finalMashStepMinutes, mashHeatLoss } = this.values; 
    this.values.mashEndTemp = parseFloat((finalMashStepTemp - ((finalMashStepMinutes / 60) * mashHeatLoss)).toFixed(2));
    return this.values.mashEndTemp;
  }
  mashOutVolume = function() {
    const { mashOut, mashEndTemp, maltQtyTotal, grainSpecificHeat, strikeWaterVolume, mashOutWaterTemp, mashOutTargetTemp } = this.values; 
    this.values.mashOutVolume = mashOut ? parseFloat(((mashOutTargetTemp - mashEndTemp) * ((maltQtyTotal * grainSpecificHeat) + strikeWaterVolume) / (mashOutWaterTemp - mashOutTargetTemp)).toFixed(2)) : 0;
    return this.values.mashOutVolume;
  }
  spargeWaterVolume = function() {
    const { totalMashWaterVolume, strikeWaterVolume, mashOutVolume } = this.values;  
    this.values.spargeWaterVolume = parseFloat((totalMashWaterVolume - (strikeWaterVolume + mashOutVolume)).toFixed(2));
    return this.values.spargeWaterVolume;
  }
  outputValues = function() {
    updateValue('#water-table-display-batchSize span', this.values.batchSize);
    updateValue('#water-table-display-kettleLoss span', this.values.kettleLoss);
    updateValue('#water-table-input-boilOff', this.values.boilOffVolume);
    updateValue('#water-table-display-boilOff span', this.values.boilOffVolume);
    updateValue('#water-table-input-preBoilVolume', this.values.preBoilVolume);
    updateValue('#water-table-display-preBoilVolume span', this.values.preBoilVolume);
    updateValue('#malts-preBoilVolume span', this.values.preBoilVolume);
    updateValue('#water-table-input-grainAbsorptionVolume', this.values.grainAbsorptionVolume);
    updateValue('#water-table-display-grainAbsorptionVolume span', this.values.grainAbsorptionVolume);
    updateValue('#water-table-input-totalMashWaterVolume', this.values.totalMashWaterVolume);
    updateValue('#water-table-display-totalMashWaterVolume span', this.values.totalMashWaterVolume);
    updateValue('#water-table-input-strikeWaterVolume', this.values.strikeWaterVolume);
    updateValue('#water-table-display-strikeWaterVolume span', this.values.strikeWaterVolume);
    updateValue('#water-table-input-mashOutVolume', this.values.mashOutVolume);
    updateValue('#water-table-display-mashOutVolume span', this.values.mashOutVolume);
    updateValue('#water-table-input-spargeWaterVolume', this.values.spargeWaterVolume);
    updateValue('#water-table-display-spargeWaterVolume span', this.values.spargeWaterVolume);
    //popover content
    document.querySelector('#water-table-display-boilOff').setAttribute('data-content', `    <span class='text-lite italic d-block'>Brewhouse Boil-Off L/hour x (Recipe Boil Minutes / 60 )</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.boilOffRate}</span> x (<span class='bold'>${this.values.boilMinutes}</span> / 60)</span>    <span class='text-lite italic d-block'>= ${this.values.boilOffVolume} L</span>    `)
    document.querySelector('#water-table-display-preBoilVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Recipe Batch Size + Brewhouse Kettle Loss + Calculated Boil-Off</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.batchSize}</span> + <span class='bold'>${this.values.kettleLoss}</span> + <span class='bold'>${this.values.boilOffVolume}</span>    </span><span class='text-lite italic d-block'>= ${this.values.preBoilVolume} L</span>`)
    document.querySelector('#water-table-display-grainAbsorptionVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Recipe Grain Absorption Rate L/kg x Recipe Total Malt Weight kg</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.grainAbsorptionRate}</span> x <span class='bold'>${this.values.maltQtyTotal}</span></span>    <span class='text-lite italic d-block'>= ${this.values.grainAbsorptionVolume} L</span>    `);
    document.querySelector('#water-table-display-totalMashWaterVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Calculated Pre-Boil Volume L + Calculated Grain Absorption L</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.preBoilVolume}</span> + <span class='bold'>${this.values.grainAbsorptionVolume}</span></span>    <span class='text-lite italic d-block'>= ${this.values.totalMashWaterVolume} L</span>    `);
    document.querySelector('#water-table-display-strikeWaterVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Brewhouse Grist Ratio L/kg x Receipe Total Malt Weight kg</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.gristRatio}</span> x <span class='bold'>${this.values.maltQtyTotal}</span></span>    <span class='text-lite italic d-block'>= ${this.values.strikeWaterVolume} L</span>    `);
    document.querySelector('#water-table-display-mashOutVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>(T2-T1) x (G + Wm) / (Tw – T2)</span>    <span class='text-lite italic d-block mb-1'>      ${this.values.mashOut ? '= (<span class="bold">' + this.values.mashOutTargetTemp + '</span> - <span class="bold">' + this.values.mashEndTemp + '</span>) x ((<span class="bold">' + this.values.maltQtyTotal + '</span> x <span class="bold">' + this.values.grainSpecificHeat + '</span>) + <span class="bold">' + this.values.strikeWaterVolume + '</span>) / (<span class="bold">' + this.values.mashOutWaterTemp + '</span> – <span class="bold">' + this.values.mashOutTargetTemp + '</span>)' : ''}    </span>    <span class='text-lite italic d-block mb-1'>      = ${this.values.mashOutVolume} L ${this.values.mashOut ? '' : '(No Mash Out on this Recipe)'}    </span>    <hr>    <span class='text-lite italic d-block'><span class='bold'>T2</span> = Brewhouse Mash Out Target Temp C</span>    <span class='text-lite italic d-block'><span class='bold'>T1</span> = Calculated Mash End Temp C (Recipe Mash Temp C, Recipe Mash Length minutes, and Brewhouse Mash Tun Heat Loss C/hour)</span>    <span class='text-lite italic d-block'><span class='bold'>G</span> = Recipe Total Malt Weight x Brewhouse Grain Specific Heat</span>    <span class='text-lite italic d-block'><span class='bold'>Wm</span> = Calculated Strike Water Volume L</span>    <span class='text-lite italic d-block'><span class='bold'>Tw</span> = Brewhouse Mash Out Water Temp C</span>    `);
    document.querySelector('#water-table-display-spargeWaterVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Calculated Total Mash Water L - (Calculated Strike Water L + Calculated Mash Out Water L)</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.totalMashWaterVolume}</span> - (<span class='bold'>${this.values.strikeWaterVolume}</span> + <span class='bold'>${this.values.mashOutVolume}</span>)</span>    <span class='text-lite italic d-block'>= ${this.values.spargeWaterVolume} L</span>    `)
  }
  water = function() {
    this.refreshInputs();
    this.boilOffVolume();
    this.preBoilVolume();
    this.grainAbsorptionVolume();
    this.totalMashWaterVolume();
    this.strikeWaterVolume();
    this.mashEndTemp();
    this.mashOutVolume();
    this.spargeWaterVolume();
    this.outputValues()
  }
}

//class for malts
//for malts and any other type of data with multiple instances, the individual instance will be responsible for updating any totals or other calcluated values that are affected by the individual instance.
class Malt {
  constructor() {
    this.values = {};
    this.recipeValues = {};
  }
  // individual malt methods
  refreshInputs = function(row, recipe) {
    this.values.qty = getFloat('input[id^="maltQty"]', row);
    this.values.ppg = getFloat('input[id^="maltPPG"]', row);
    this.values.lovibond = getFloat('input[id^="maltLovibond"]', row);
    this.recipeValues = recipe;
  }
  points = function() {
    const { qty, ppg } = this.values;
    const { preBoilVolume } = this.recipeValues;
    this.values.points = parseFloat(((ppg * 8.3454) * qty / preBoilVolume).toFixed(0)); // convert ppg value to a metric value by multiplying by 8.3454
    return this.values.points;
  }
  mcu = function() {
    const { lovibond, qty, recipeValues } = this.values;
    const { batchSize } = this.recipeValues;
    this.values.mcu = parseFloat(((lovibond * 8.3454) * qty / batchSize).toFixed(2)); // convert lovibond value to a metric value by multiplying by 8.3454
    return this.values.mcu;
  }
  srm = function() {
    const { mcu } = this.values;
    this.values.srm = parseFloat((1.4922 * (mcu ** 0.6859)).toFixed(2)); // Morey SRM
    return this.values.srm;
  }
  // malt totals
  totalMaltQty = function() {
    this.values.totalMaltQty = parseFloat((sumValues('input[id^="maltQty\\["]').toFixed(3)));
    return this.values.totalMaltQty;
  }
  totalGravityPoints = function() {
    this.values.totalGravityPoints = sumValues('input[id^="maltGravityPoints"]');
    return this.values.totalGravityPoints;
  }
  totalMaltMcu = function() {
    this.values.totalMaltMcu = parseFloat((sumValues('input[id^="maltMCUInput\\["]').toFixed(2)));
    return this.values.totalMaltMcu;
  }
  totalMaltSrm = function() {
    const { totalMaltMcu } = this.values;
    this.values.totalMaltSrm = parseFloat((1.4922 * (totalMaltMcu ** 0.6859)).toFixed(2));
    return this.values.totalMaltSrm;
  }
  expectedGravity = function() {
    const { totalGravityPoints } = this.values;  
    const { conversionPercent } = this.recipeValues; 
    this.values.expectedGravity = parseFloat((totalGravityPoints * (conversionPercent / 100)).toFixed(0));
    return this.values.expectedGravity;
  }
  srmHex = function() {
    const { totalMaltSrm } = this.values;
    const colors = [{ hex: "#FFE699", srm: "1" }, { hex: "#FFD878", srm: "2" }, { hex: "#FFCA5A", srm: "3" }, { hex: "#FFBF42", srm: "4" }, { hex: "#FBB123", srm: "5" }, { hex: "#F8A600", srm: "6" }, { hex: "#F39C00", srm: "7" }, { hex: "#EA8F00", srm: "8" }, { hex: "#E58500", srm: "9" }, { hex: "#DE7C00", srm: "10" }, { hex: "#D77200", srm: "11" }, { hex: "#CF6900", srm: "12" }, { hex: "#CB6200", srm: "13" }, { hex: "#C35900", srm: "14" }, { hex: "#BB5100", srm: "15" }, { hex: "#B54C00", srm: "16" }, { hex: "#B04500", srm: "17" }, { hex: "#A63E00", srm: "18" }, { hex: "#A13700", srm: "19" }, { hex: "#9B3200", srm: "20" }, { hex: "#952D00", srm: "21" }, { hex: "#8E2900", srm: "22" }, { hex: "#882300", srm: "23" }, { hex: "#821E00", srm: "24" }, { hex: "#7B1A00", srm: "25" }, { hex: "#771900", srm: "26" }, { hex: "#701400", srm: "27" }, { hex: "#6A0E00", srm: "28" }, { hex: "#660D00", srm: "29" }, { hex: "#5E0B00", srm: "30" }, { hex: "#5A0A02", srm: "31" }, { hex: "#600903", srm: "32" }, { hex: "#520907", srm: "33" }, { hex: "#4C0505", srm: "34" }, { hex: "#470606", srm: "35" }, { hex: "#440607", srm: "36" }, { hex: "#3F0708", srm: "37" }, { hex: "#3B0607", srm: "38" }, { hex: "#3A070B", srm: "39" }, { hex: "#36080A", srm: "40" }]
    const { hex } = totalMaltSrm ? colors.filter(color => color.srm == Math.floor(totalMaltSrm))[0] : '#FFFFFF';
    this.values.srmHex = hex;
    return this.values.srmHex;
  }
  outputValues = function(row) { 
    updateValue('input[id^="maltGravityPointsInput"]', this.values.points, row);
    updateValue('span[id^="maltGravityPointsDisplay"]', this.values.points, row);
    updateValue('input[id^="maltMCUInput"]', this.values.mcu, row);
    updateValue('span[id^="maltMCUDisplay"]', this.values.mcu, row);
    updateValue('input[id^="maltSRMInput\\["]', this.values.srm, row);
    updateValue('span[id^="maltSRMDisplay"]', this.values.srm, row);
    updateValue('#maltTotalsQtyDisplay', this.values.totalMaltQty);
    updateValue('#maltTotalsQtyInput', this.values.totalMaltQty);
    updateValue('#maltTotalsPointsDisplay', this.values.totalGravityPoints);
    updateValue('#maltTotalsPointsInput', this.values.totalGravityPoints);
    updateValue('#maltTotalsMCUDisplay', this.values.totalMaltMcu);
    updateValue('#maltTotalsMCUInput', this.values.totalMaltMcu);
    updateValue('#maltTotalsSRMDisplay', this.values.totalMaltSrm);
    updateValue('#maltTotalsSRMInput', this.values.totalMaltSrm);
    updateValue('#malts-expectedPreBoilGravity', this.values.expectedGravity);
    document.querySelector('#maltTotalsSRMInput').parentElement.style.backgroundColor = this.values.srmHex;
  }
  malt = function(recipe, row) {
    this.refreshInputs(row, recipe);
    this.points();
    this.mcu();
    this.srm();
    this.outputValues(row); // output row-level results to DOM so that totals below update immediately
    this.totalMaltQty();
    this.totalGravityPoints();
    this.totalMaltMcu();
    this.totalMaltSrm();
    this.expectedGravity();
    this.srmHex();
    this.outputValues(row);
  }
}

// sum all values from inputs matching the css selector passed in - ultimately an argument for querySelectorAll()
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

// get current textContent, value, or 0 from the specific element matching the css selector passed in - ultimately used with querySelector.
// can optionally pass in a particular dom node to search for matching elements within
const getFloat = function(cssSelector, domNode = document) {
  let node = domNode.querySelector(cssSelector);
  return node.nodeName === 'INPUT' ? parseFloat(node.value || 0) : parseFloat(node.textContent || 0);
}

// set the value or textContent of a specific element matching the css selector passed in
// get current textContent, value, or 0 from the specific element matching the css selector passed in - ultimately used with querySelector.
// can optionally pass in a particular dom node to search for matching elements within
const updateValue = function(cssSelector, val, domNode = document) {
  let node = domNode.querySelector(cssSelector);
  node && node.nodeName === 'INPUT' ? node.value = val : node.textContent = val;
}

//EVENT LISTENERS


// malt table
document.querySelector('#malt-table-container').addEventListener('input', async (e) => {
  const m = new Malt();
  const maltRow = e.target.parentElement.parentElement;
  m.malt(r.values, maltRow);
  r.water();
})
// targets
document.querySelector('#target-container').addEventListener('input', (e) => {
  r.water();
})

// boil minutes
document.querySelector('#boilMinutes').addEventListener('input', (e) => {
  r.water();
})

// Brewhouse values (i.e. when overriding)
document.querySelector('#brewhouse-container').addEventListener('input', (e) => {
  r.water();
})

// Mash Out Toggler
// use of setTimeout() is a little janky. Bug in BS4 where radio buttons seem to be eating events on the underlying inputs.
// a click event on the parent element will cause the calc to run before the radios have been updated. A short delay resolves this.
document.querySelector('#mashOutToggle').addEventListener('click', () => {
  setTimeout(() => {
    r.water();
  }, 100);
})

// mash table
document.querySelector('#mash-table-container').addEventListener('input', (e) => {
  r.water();
})

// brewhouse profile
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
      $("#malts-conversionPercent").text(data.conversionPercent);
      r.water();

    })
  }
});

// initialize recipe class
const r = new Recipe();