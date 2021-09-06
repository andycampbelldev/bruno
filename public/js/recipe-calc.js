/* 

Design Notes:

+ Create a recipe class with all the methods needed to calculate recipe-level values - recipe totals, gravity etc.
+ instantiate a new recipe object when the page loads
+ On each input event, 
  - pull in all the required values from the DOM
  - run all calculator methods
  - output values to the DOM

+ Have classes for each multi-instance recipe entity, like malts and hops.
+ instantiate a new object from these classes on page load
+ Whenever there is input on one of these rows
  - pull in all values from the row, and also from the recipe object
  - Run calculations
  - Output row level values to the DOM
  - Run total calculations - each time there's a change at the row level, the totals for the relevant entity should be updated.
  - Output total values.

+ Event delegation
  - related inputs are put into divs with a "container" id attribute - e.g. water-container.
  - that container element will have the "calc" class and an additional class to indicate which methods should be run when there is input to the container
    - e.g. "calc calc-water/calc-malt/calc-hop/calc-mash/calc-ferm/calc-yeast"
  - this somewhat simplifies our logic for creating event listeners. If the element has the calc class, we'll assign an appropriate event handler based on the other calc class
    - e.g. calc-water, then run water(), malt() for each malt row, then gravity().

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
    this.values.expectedFinalGravity = getFloat('#expectedFinalGravityInput');
    this.values.expectedOriginalGravity = getFloat('#expectedOriginalGravityInput');
    this.values.totalMaltQty = getFloat('#maltTotalsQtyInput');
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
    this.values.finalMashStepTemp = mashStepTemps.length > 0 ? parseFloat(mashStepTemps[mashStepTemps.length - 1].value || 0) : 0;
    this.values.finalMashStepMinutes = mashStepMins.length > 0 ? parseFloat(mashStepMins[mashStepMins.length - 1].value || 0) : 0;
    this.values.conversionPercent = getFloat('#conversionPercent');
    this.values.totalGravityPoints = getFloat('#maltTotalsPointsInput');
    this.values.totalMaltMCU = getFloat('#maltTotalsMCUInput');
    this.values.totalMaltSRM = getFloat('#maltTotalsSRMInput');
    this.values.yeastAttenuation = getFloat('#yeastAttenuation');
  }
  //water methods
  boilOffVolume = function() {
    const { boilOffRate, boilMinutes } = this.values;
    this.values.boilOffVolume = parseFloat((boilOffRate * (boilMinutes / 60)).toFixed(2)) || 0;
    return this.values.boilOffVolume;
  }
  preBoilVolume = function() {
    const { batchSize, kettleLoss, boilOffVolume } = this.values;
    this.values.preBoilVolume = parseFloat((batchSize + kettleLoss + boilOffVolume).toFixed(2)) || 0;
    return this.values.preBoilVolume;
  }
  postBoilVolume = function() {
    const { boilOffVolume, preBoilVolume } = this.values;
    this.values.postBoilVolume = parseFloat((preBoilVolume - boilOffVolume).toFixed(2)) || 0;
  }
  grainAbsorptionVolume = function() {
    const { totalMaltQty, grainAbsorptionRate } = this.values;
    this.values.grainAbsorptionVolume = parseFloat((totalMaltQty * grainAbsorptionRate).toFixed(2)) || 0;
    return this.values.grainAbsorptionVolume;
  }
  totalMashWaterVolume = function() {
    const { preBoilVolume, grainAbsorptionVolume } = this.values;
    this.values.totalMashWaterVolume = parseFloat((preBoilVolume + grainAbsorptionVolume).toFixed(2)) || 0;
    return this.values.totalMashWaterVolume;
  }
  strikeWaterVolume = function() {
    const { gristRatio, totalMaltQty } = this.values;  
    this.values.strikeWaterVolume = parseFloat((gristRatio * totalMaltQty).toFixed(2)) || 0;
    return this.values.strikeWaterVolume;
  }
  mashEndTemp = function() {
    const { finalMashStepTemp, finalMashStepMinutes, mashHeatLoss } = this.values; 
    this.values.mashEndTemp = parseFloat((finalMashStepTemp - ((finalMashStepMinutes / 60) * mashHeatLoss)).toFixed(2)) || 0;
    return this.values.mashEndTemp;
  }
  totalMashMinutes = function() {
    this.values.totalMashMinutes = sumValues('input[id^="mashMins"]');
    return this.values.totalMashMinutes;
  }
  mashOutVolume = function() {
    const { mashOut, mashEndTemp, totalMaltQty, grainSpecificHeat, strikeWaterVolume, mashOutWaterTemp, mashOutTargetTemp } = this.values; 
    this.values.mashOutVolume = mashOut ? parseFloat(((mashOutTargetTemp - mashEndTemp) * ((totalMaltQty * grainSpecificHeat) + strikeWaterVolume) / (mashOutWaterTemp - mashOutTargetTemp)).toFixed(2)) || 0 : 0;
    return this.values.mashOutVolume;
  }
  spargeWaterVolume = function() {
    const { totalMashWaterVolume, strikeWaterVolume, mashOutVolume } = this.values;  
    this.values.spargeWaterVolume = parseFloat((totalMashWaterVolume - (strikeWaterVolume + mashOutVolume)).toFixed(2)) || 0;
    return this.values.spargeWaterVolume;
  }
  // gravity methods
  expectedPreBoilGravity = function() {
    const { totalGravityPoints, conversionPercent } = this.values;  
    this.values.expectedPreBoilGravity = parseFloat(((totalGravityPoints * (conversionPercent / 100)).toFixed(0) / 1000) + 1) || 1;
    return this.values.expectedPreBoilGravity;
  }
  expectedOriginalGravity = function() {
    const { expectedPreBoilGravity, preBoilVolume, postBoilVolume } = this.values;
    this.values.expectedOriginalGravity = parseFloat((((((expectedPreBoilGravity - 1) * 1000) * preBoilVolume) / postBoilVolume).toFixed(0) / 1000) + 1) || 1;
    return this.values.expectedOriginalGravity;
  }
  expectedFinalGravity = function() {
    const { expectedOriginalGravity, yeastAttenuation } = this.values;
    this.values.expectedFinalGravity = parseFloat(((((expectedOriginalGravity - 1) * 1000) * ((100 - yeastAttenuation) / 100)).toFixed(0) / 1000) + 1) || 1;
    return this.values.expectedFinalGravity;
  }
  expectedABV = function() {
    const { expectedOriginalGravity, expectedFinalGravity } = this.values;
    this.values.expectedABV = parseFloat(((expectedOriginalGravity - expectedFinalGravity) * 131.25).toFixed(1)) || 0;
    return this.values.expectedABV;
  }
  totalFermDays = function() {
    this.values.totalFermDays = sumValues('input[id^="fermDays"');
    return this.values.totalFermDays;
  }
  getBrewhouse = async function(id) {
    let data
    if(id) {
      const request = new Request(
        `/brewhouses/${id}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        }
        )
      try {
        const res = await fetch(request);
        if (res.status >= 400) {
          throw new Error(res)
        } else {
          data = await res.json();
        }
      } catch (err) {
        throw new Error(`Error getting Brewhouse: ${err}`);
      }
    }
      updateValue('#conversionPercent', data ? data.conversionPercent : 0)
      updateValue('#boilOffRate', data ? data.boilOffRate : 0);
      updateValue('#kettleLoss', data ? data.kettleLoss : 0);
      updateValue('#grainAbsorptionRate', data ? data.grainAbsorptionRate : 0);
      updateValue('#gristRatio', data ? data.gristRatio : 0);
      updateValue('#mashOutTargetTemp', data ? data.mashOutTargetTemp : 0);
      updateValue('#mashOutWaterTemp', data ? data.mashOutWaterTemp : 0);
      updateValue('#spargeWaterTemp', data ? data.spargeWaterTemp : 0);
      updateValue('#mashHeatLoss', data ? data.mashHeatLoss : 0);
      updateValue('#grainSpecificHeat', data ? data.grainSpecificHeat : 0);
      updateValue('#malts-conversionPercent', data ? data.conversionPercent : 0);
  }
  // calculators
  water = function() {
    this.refreshInputs();
    this.boilOffVolume();
    this.preBoilVolume();
    this.postBoilVolume();
    this.grainAbsorptionVolume();
    this.totalMashWaterVolume();
    this.strikeWaterVolume();
    this.mashEndTemp();
    this.mashOutVolume();
    this.spargeWaterVolume();
    updateValue('#target-display-batchSize', this.values.batchSize);
    updateValue('#water-table-display-batchSize span', this.values.batchSize);
    updateValue('#water-table-display-kettleLoss span', this.values.kettleLoss);
    updateValue('#water-table-input-boilOff', this.values.boilOffVolume);
    updateValue('#water-table-display-boilOff span', this.values.boilOffVolume);
    updateValue('#water-table-input-preBoilVolume', this.values.preBoilVolume);
    updateValue('#water-table-display-preBoilVolume span', this.values.preBoilVolume);
    updateValue('#malts-preBoilVolume', this.values.preBoilVolume);
    updateValue('#malts-display-postBoilVolume', this.values.postBoilVolume);
    updateValue('#malts-conversionPercent', this.values.conversionPercent);
    updateValue('#malts-input-postBoilVolume', this.values.postBoilVolume);
    updateValue('#water-table-input-grainAbsorptionVolume', this.values.grainAbsorptionVolume);
    updateValue('#water-table-display-grainAbsorptionVolume span', this.values.grainAbsorptionVolume);
    updateValue('#water-table-input-totalMashWaterVolume', this.values.totalMashWaterVolume);
    updateValue('#water-table-display-totalMashWaterVolume span', this.values.totalMashWaterVolume);
    updateValue('#water-table-input-strikeWaterVolume', this.values.strikeWaterVolume);
    updateValue('#water-table-display-strikeWaterVolume span', this.values.strikeWaterVolume);
    updateValue('#water-table-input-mashEndTemp', this.values.mashEndTemp);
    updateValue('#water-table-input-mashOutVolume', this.values.mashOutVolume);
    updateValue('#water-table-display-mashOutVolume span', this.values.mashOutVolume);
    updateValue('#water-table-input-spargeWaterVolume', this.values.spargeWaterVolume);
    updateValue('#water-table-display-spargeWaterVolume span', this.values.spargeWaterVolume);
    //popover content
    document.querySelector('#water-table-display-boilOff').setAttribute('data-content', `    <span class='text-lite italic d-block'>Brewhouse Boil-Off L/hour x (Recipe Boil Minutes / 60 )</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.boilOffRate}</span> x (<span class='bold'>${this.values.boilMinutes}</span> / 60)</span>    <span class='text-lite italic d-block'>= ${this.values.boilOffVolume} L</span>    `)
    document.querySelector('#water-table-display-preBoilVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Recipe Batch Size + Brewhouse Kettle Loss + Calculated Boil-Off</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.batchSize}</span> + <span class='bold'>${this.values.kettleLoss}</span> + <span class='bold'>${this.values.boilOffVolume}</span>    </span><span class='text-lite italic d-block'>= ${this.values.preBoilVolume} L</span>`)
    document.querySelector('#water-table-display-grainAbsorptionVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Recipe Grain Absorption Rate L/kg x Recipe Total Malt Weight kg</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.grainAbsorptionRate}</span> x <span class='bold'>${this.values.totalMaltQty}</span></span>    <span class='text-lite italic d-block'>= ${this.values.grainAbsorptionVolume} L</span>    `);
    document.querySelector('#water-table-display-totalMashWaterVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Calculated Pre-Boil Volume L + Calculated Grain Absorption L</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.preBoilVolume}</span> + <span class='bold'>${this.values.grainAbsorptionVolume}</span></span>    <span class='text-lite italic d-block'>= ${this.values.totalMashWaterVolume} L</span>    `);
    document.querySelector('#water-table-display-strikeWaterVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Brewhouse Grist Ratio L/kg x Receipe Total Malt Weight kg</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.gristRatio}</span> x <span class='bold'>${this.values.totalMaltQty}</span></span>    <span class='text-lite italic d-block'>= ${this.values.strikeWaterVolume} L</span>    `);
    document.querySelector('#water-table-display-mashOutVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>(T2-T1) x (G + Wm) / (Tw – T2)</span>    <span class='text-lite italic d-block mb-1'>      ${this.values.mashOut ? '= (<span class="bold">' + this.values.mashOutTargetTemp + '</span> - <span class="bold">' + this.values.mashEndTemp + '</span>) x ((<span class="bold">' + this.values.totalMaltQty + '</span> x <span class="bold">' + this.values.grainSpecificHeat + '</span>) + <span class="bold">' + this.values.strikeWaterVolume + '</span>) / (<span class="bold">' + this.values.mashOutWaterTemp + '</span> – <span class="bold">' + this.values.mashOutTargetTemp + '</span>)' : ''}    </span>    <span class='text-lite italic d-block mb-1'>      = ${this.values.mashOutVolume} L ${this.values.mashOut ? '' : '(No Mash Out on this Recipe)'}    </span>    <hr>    <span class='text-lite italic d-block'><span class='bold'>T2</span> = Brewhouse Mash Out Target Temp C</span>    <span class='text-lite italic d-block'><span class='bold'>T1</span> = Calculated Mash End Temp C (Recipe Mash Temp C, Recipe Mash Length minutes, and Brewhouse Mash Tun Heat Loss C/hour)</span>    <span class='text-lite italic d-block'><span class='bold'>G</span> = Recipe Total Malt Weight x Brewhouse Grain Specific Heat</span>    <span class='text-lite italic d-block'><span class='bold'>Wm</span> = Calculated Strike Water Volume L</span>    <span class='text-lite italic d-block'><span class='bold'>Tw</span> = Brewhouse Mash Out Water Temp C</span>    `);
    document.querySelector('#water-table-display-spargeWaterVolume').setAttribute('data-content', `    <span class='text-lite italic d-block'>Calculated Total Mash Water L - (Calculated Strike Water L + Calculated Mash Out Water L)</span>    <span class='text-lite italic d-block'>= <span class='bold'>${this.values.totalMashWaterVolume}</span> - (<span class='bold'>${this.values.strikeWaterVolume}</span> + <span class='bold'>${this.values.mashOutVolume}</span>)</span>    <span class='text-lite italic d-block'>= ${this.values.spargeWaterVolume} L</span>    `)
  }
  gravity = function() {
    this.refreshInputs();
    this.expectedPreBoilGravity();
    this.expectedOriginalGravity();
    this.expectedFinalGravity();
    this.expectedABV();
    updateValue('#malts-expectedPreBoilGravity', this.values.expectedPreBoilGravity.toFixed(3));
    updateValue('#expectedpreBoilGravityInput', this.values.expectedPreBoilGravity.toFixed(3));
    updateValue('#malts-expectedOriginalGravity', this.values.expectedOriginalGravity.toFixed(3));
    updateValue('#expectedOriginalGravityInput', this.values.expectedOriginalGravity);
    updateValue('#expectedOriginalGravityDisplay', this.values.expectedOriginalGravity.toFixed(3));
    updateValue('#expectedFinalGravityInput', this.values.expectedFinalGravity);
    updateValue('#expectedFinalGravityDisplay', this.values.expectedFinalGravity.toFixed(3));
    updateValue('#expectedABVInput', this.values.expectedABV);
    updateValue('#expectedABVDisplay', this.values.expectedABV);
  }
  mash = function() {
    this.totalMashMinutes();
    updateValue('#totalMashMinutesInput', this.values.totalMashMinutes);
    updateValue('#totalMashMinutesDisplay', this.values.totalMashMinutes);
  }
  ferm = function() {
    this.totalFermDays();
    updateValue('#totalFermDaysInput', this.values.totalFermDays);
    updateValue('#totalFermDaysDisplay', this.values.totalFermDays);
  }
}

class Malt {
  constructor() {
    this.values = {};
    this.recipeValues = {};
  }
  refreshInputs = function(recipe, row) {
    this.values.qty = row ? getFloat('input[id^="maltQty"]', row) : 0;
    this.values.ppg = row ? getFloat('input[id^="maltPPG"]', row) : 0;
    this.values.lovibond = row ? getFloat('input[id^="maltLovibond"]', row) : 0;
    this.recipeValues = recipe;
  }
  points = function() {
    const { qty, ppg } = this.values;
    const { preBoilVolume } = this.recipeValues;
    this.values.points = preBoilVolume ? parseFloat(((ppg * 8.3454) * qty / preBoilVolume).toFixed(0)) : 0; // convert ppg value to a metric value by multiplying by 8.3454
    return this.values.points;
  }
  mcu = function() {
    const { lovibond, qty, recipeValues } = this.values;
    const { batchSize } = this.recipeValues;
    this.values.mcu = parseFloat(((lovibond * 8.3454) * qty / batchSize).toFixed(2)) || 0; // convert lovibond value to a metric value by multiplying by 8.3454
    return this.values.mcu;
  }
  srm = function() {
    const { mcu } = this.values;
    this.values.srm = parseFloat((1.4922 * (mcu ** 0.6859)).toFixed(2)) || 0; // Morey SRM
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
    this.values.totalMaltSrm = parseFloat((1.4922 * (totalMaltMcu ** 0.6859)).toFixed(2)) || 0;
    return this.values.totalMaltSrm;
  }
  srmHex = function() {
    const totalMaltSrm = Math.floor(this.values.totalMaltSrm);
    const colors = [{ hex: "#FFE699", srm: "1" }, { hex: "#FFD878", srm: "2" }, { hex: "#FFCA5A", srm: "3" }, { hex: "#FFBF42", srm: "4" }, { hex: "#FBB123", srm: "5" }, { hex: "#F8A600", srm: "6" }, { hex: "#F39C00", srm: "7" }, { hex: "#EA8F00", srm: "8" }, { hex: "#E58500", srm: "9" }, { hex: "#DE7C00", srm: "10" }, { hex: "#D77200", srm: "11" }, { hex: "#CF6900", srm: "12" }, { hex: "#CB6200", srm: "13" }, { hex: "#C35900", srm: "14" }, { hex: "#BB5100", srm: "15" }, { hex: "#B54C00", srm: "16" }, { hex: "#B04500", srm: "17" }, { hex: "#A63E00", srm: "18" }, { hex: "#A13700", srm: "19" }, { hex: "#9B3200", srm: "20" }, { hex: "#952D00", srm: "21" }, { hex: "#8E2900", srm: "22" }, { hex: "#882300", srm: "23" }, { hex: "#821E00", srm: "24" }, { hex: "#7B1A00", srm: "25" }, { hex: "#771900", srm: "26" }, { hex: "#701400", srm: "27" }, { hex: "#6A0E00", srm: "28" }, { hex: "#660D00", srm: "29" }, { hex: "#5E0B00", srm: "30" }, { hex: "#5A0A02", srm: "31" }, { hex: "#600903", srm: "32" }, { hex: "#520907", srm: "33" }, { hex: "#4C0505", srm: "34" }, { hex: "#470606", srm: "35" }, { hex: "#440607", srm: "36" }, { hex: "#3F0708", srm: "37" }, { hex: "#3B0607", srm: "38" }, { hex: "#3A070B", srm: "39" }, { hex: "#36080A", srm: "40" }]
    const { hex } = totalMaltSrm > 0 ? colors.filter(color => color.srm == totalMaltSrm)[0] : { hex: '#FFFFFF' };
    this.values.srmHex = hex;
    return this.values.srmHex;
  }
  malt = function(recipe, row) {
    this.refreshInputs(recipe, row);
    row && this.points();
    row && this.mcu();
    row && this.srm();
    // output row-level results to DOM so that totals below update immediately
    row && updateValue('input[id^="maltGravityPointsInput"]', this.values.points, row);
    row && updateValue('span[id^="maltGravityPointsDisplay"]', this.values.points, row);
    row && updateValue('input[id^="maltMCUInput"]', this.values.mcu, row);
    row && updateValue('span[id^="maltMCUDisplay"]', this.values.mcu, row);
    row && updateValue('input[id^="maltSRMInput\\["]', this.values.srm, row);
    row && updateValue('span[id^="maltSRMDisplay"]', this.values.srm, row);
    this.totalMaltQty();
    this.totalGravityPoints();
    this.totalMaltMcu();
    this.totalMaltSrm();
    this.srmHex();
    updateValue('#maltTotalsQtyDisplay', this.values.totalMaltQty);
    updateValue('#maltTotalsQtyInput', this.values.totalMaltQty);
    updateValue('#maltTotalsPointsDisplay', this.values.totalGravityPoints);
    updateValue('#maltTotalsPointsInput', this.values.totalGravityPoints);
    updateValue('#maltTotalsMCUDisplay', this.values.totalMaltMcu);
    updateValue('#maltTotalsMCUInput', this.values.totalMaltMcu);
    updateValue('#maltTotalsSRMDisplay', this.values.totalMaltSrm);
    updateValue('#maltTotalsSRMInput', this.values.totalMaltSrm);
    updateValue('#maltTotalsSRMHexInput', this.values.srmHex);
    document.querySelector('#maltTotalsSRMInput').parentElement.style.backgroundColor = this.values.srmHex;
  }
}

class Hop {
  constructor() {
    this.values = {};
    this.recipeValues = {};
  }
  refreshInputs = function(recipe, row) {
    this.values.qty = row ? getFloat('input[id^="hopQty"]', row) : 0;
    this.values.aa = row ? getFloat('input[id^="hopAA"]', row) : 0;
    this.recipeValues = recipe;
  }
  aau = function() {
    const { qty, aa } = this.values;
    this.values.aau = parseFloat((qty * (aa / 100)).toFixed(2)) || 0;
    return this.aau;
  }
  // add methods for hop total qty and total aau
  totalHopQty = function() {
    this.values.totalHopQty = parseFloat((sumValues('input[id^="hopQty\\["]').toFixed(2)));
    return this.values.totalHopQty;
  }
  totalHopAAU = function() {
    this.values.totalHopAAU = parseFloat((sumValues('input[id^="hopAAUInput\\["]').toFixed(2)));
    return this.values.totalHopAAU
  }
  // if no row passed in, will skip row-level methods and just update hop totals (i.e. if all rows are deleted from hop table)
  hop = function(recipe, row) {
    this.refreshInputs(recipe,row);
    row && this.aau();
    // output row-level results to DOM so that totals below update immediately
    row && updateValue('input[id^="hopAAUInput"]', this.values.aau, row);
    row && updateValue('span[id^="hopAAUDisplay"]', this.values.aau, row);
    this.totalHopQty();
    this.totalHopAAU();
    updateValue('#hopTotalsQtyInput', this.values.totalHopQty);
    updateValue('#hopTotalsQtyDisplay', this.values.totalHopQty);
    updateValue('#hopTotalsAAUInput', this.values.totalHopAAU);
    updateValue('#hopTotalsAAUDisplay', this.values.totalHopAAU);
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

// EVENT LISTENERS

let sections = document.querySelectorAll('.calc');
for (let section of sections) {
  // water
  if (section.classList.contains('calc-water')) {
    section.addEventListener('input', e => {
      r.water();
      if (r.values.totalMaltQty > 0) {
        const maltRows = document.querySelectorAll('.malt-row');
        for (let row of maltRows) {
          m.malt(r.values, row);
        }
      }
      r.gravity();
    })
  }
  // malt
  if (section.classList.contains('calc-malt')) {
    section.addEventListener('input', e => {
      const maltRow = e.target.closest('.malt-row');
      m.malt(r.values, maltRow);
      r.gravity();
      r.water();
    })
  }
  // hop
  if (section.classList.contains('calc-hop')) {
    section.addEventListener('input', e => {
      const hopRow = e.target.closest('.hop-row');
      h.hop(r.values, hopRow);
    })
  }
  // mash
  if (section.classList.contains('calc-mash')) {
    section.addEventListener('input', e => {
      r.water();
      r.mash();
    })
  }  
  // ferm
  if (section.classList.contains('calc-ferm')) {
    section.addEventListener('input', e => {
      r.ferm();
    })
  }
  // yeast
  if (section.classList.contains('calc-yeast')) {
    section.addEventListener('input', e => {
      r.gravity();
    })
  }
}

// Mash Out Toggler
// use of setTimeout() is a little janky. Bug in BS4 where radio buttons seem to be eating events on the underlying inputs.
// a click event on the parent element will cause the calc to run before the radios have been updated. A short delay resolves this.
document.querySelector('#mashOutToggle').addEventListener('click', () => {
  setTimeout(() => {
    r.water();
  }, 100);
})

// brewhouse profile
document.querySelector('#brewhouse-select').addEventListener('change', async function() {
  const placeholder = document.querySelector('#brewhouse-placeholder');
  if(this.value) {
    await r.getBrewhouse(this.value);
    placeholder.removeAttribute('disabled');
  } else {
    await r.getBrewhouse();
    placeholder.setAttribute('disabled', '');
  }
  r.water();
  if(r.values.totalMaltQty > 0) {
    const maltRows = document.querySelectorAll('.malt-row');
    for (let row of maltRows) {
      m.malt(r.values, row);
    }
  }
  r.gravity();
})

// initialize recipe, malt and hop class
const r = new Recipe();
const m = new Malt();
const h = new Hop();

// on load, run each calculator once to initalize the values property on each class
// this is needed for the recipe edit form to ensure all required inputs are available for a potential update on any field.
r.water();
if(document.querySelector('.malt-row')) {
  m.malt(r.values, document.querySelector('.malt-row')); //first malt row only
}
if(document.querySelector('.hop-row')) {
  h.hop(r.values, document.querySelector('.hop-row') )
}
r.gravity();
r.mash();
r.ferm();
