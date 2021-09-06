# BRUNO

An Express.js web app for brewers to develop and organize beer recipes, including automatic calculation of water, malt, gravity and hop related properties.

## Contents
- [Schema](#schema)
- [Recipe Calculations and Formulas](#recipe-calculations-and-formulas)
- [Dates](#dates)

## Schema
Brewing related data in BRUNO is organized as follows:

**Beer** is the top level entity, and the ultimate goal. The Beer has a name and style (e.g. Cascading Delete, Aotearoa Pale Ale).

Each Beer must have at least one **Recipe** associated with it. 
- As the name implies, the Recipe is all the information needed to successfully brew the Beer, with enough detail to allow consistency and repeatability between brews. This includes all ingredients, volumes, temperatures, timings and other steps necessary to brew the beer as intended. A given Recipe is specific to exactly one Beer.
- Recipes can also be copied and versioned, and each Version can be copied as the starting point for a new Recipe. New Versions are given a version number, version date (the date the version was created), and a brief comment about what is different about this version compared to the source version. An example of this might be when the Brewer intends to try a known recipe with a different yeast strain.
- A new Version might also be used as the Version 1 Recipe for an entirely different Beer. This will be useful when wanting to brew a Beer of a related style to an existing Beer.
- This implementation of Recipes does not allow Recipes to be scaled for smaller or larger batch sizes. This is because the batch size forms part of the Recipe, and the Recipe also references a specific **Brewhouse Profile** which is a collection of known volume and temperature inputs associated with specific equipment and brewing methods. Recipes were designed this way so that water volumes formed part of the Recipe, as these directly affect the gravity of the Beer.

A **Brew** is an instance of a Recipe being brewed. This is where notes and measurements from brew day are recorded.
- Any day-of calculations will be handled at this point. An example would be  using the temperature of the grain to calculate the correct Strike Water temperature, as it's difficult to predict and control what the grain temperature will be in advance.

Brewers can create a **Brewhouse Profile** to represent known volume and temperature values from specific brewing equipment and processes. For example, for smaller batches, the Brewer may choose to use a smaller kettle on the stove, rather than a larger kettle with a more powerful propane burner. This would result in less kettle loss and boil-off, and therefore affect the water calculations that occur on the Recipe. This allows the Brewer the option to do both extract and all-grain brewing with a degree of predictability.

There will soon be a **General Settings** schema. This will allow some values to be moved from the current Brewhouse Profile into General Settings - e.g. default Mash Out Target Temperature, Grain Specific Heat. There will be further updates around this in future.



## Recipe Calculations and Formulas

Recipe calculation logic currently lives in the client-side recipe.js file. Currently *only metric values are supported.*

The calculations are complex given the interdependency between different Recipe elements:

- **Water Volume** affects each **Malt**, and ultimately **Gravity**
- **Malt** affects **Water Volume** (Grain Loss, and therefore Strike Volume) and **Gravity**
- **Mash Steps** affects **Water Temperature** (the anticipated amount of Mash Out Water required). Water Volume isn't affected, so there is no need to recalculate Malts when there are changes to Mash Steps.
- **Yeast Attenuation** affects **Gravity**
- **Fermentation Stages** are standalone
- **Hops** are currently standalone

|Calculation|Formula|Notes|
|------------|--------|-------|
|Boil-Off Volume| Boil-Off Rate x Boil Length|- Boil-Off Rate is expressed in Litres per Hour <br>- Boil Length is expressed in Hours|
|Pre-Boil Volume|Batch Size + Kettle Loss + Boil Off Volume|- All expressed in Litres|
|Post-Boil Volume|Pre-Boil Volume - Boil-Off Volume|- All expressed in Litres|
|Grain Absorption Volume|Total Malt Quantity x Grain Absorption Rate|- Malt Qty expressed in Kilograms <br>- Grain Absorption Rate is Litres of Strike Water per Kilogram of Malt <br>- Grain Absorption Volume expressed in Litres|
|Total Mash Water Volume|Pre-Boil Volume + Grain Absorption Volume|- All expressed in Litres|
|Strike Water Volume|Grist Ratio x Total Malt Quantity|- Grist Ratio is Litres of Strike Water per Kilogram of Grain <br>- Total Malt Quantity expressed in Kilograms <br>- Strike Water Volume expressed in Litres|
|Mash Out Water Volume|(T2 - T1) x (G + Wm) / (Tw - T2)|- T2 = Target Mash Out Temperature in degrees Celsius <br>- T1 = Mash End Temperature in degrees Celsius <br>- G = Recipe Total Malt Weight x Grain Specific Heat <br>- Wm = Strike Water Volume <br>- Tw = Mash Out Water Temperature in degrees Celsius <br>- Mash Out Water Volume expressed in Litres|
|Sparge Water Volume|Total Mash Water Volume - (Strike Water Volume + Mash Out Water Volume) |- All expressed in Litres|
|Pre-Boil Gravity Points|Total Gravity Points x Expected Brewhouse Conversion %|- Pre-Boil Gravity is expressed as gravity points, not Specific Gravity relative to water. e.g. 50, not 1.050 |
|Original Gravity|(Pre-Boil Gravity Points x Pre-Boil Volume) / Post-Boil Volume|- Pre-Boil Gravity Points expressed as Gravity Points, not Specific Gravity e.g. 50 Points <br>- Pre and Post-Boil Volume expressed in Litres  <br>- Original Gravity expressed as Gravity Points e.g. 59. To convert to Specific Gravity, divide by 1000 and then add 1|
|Final Gravity|Original Gravity Points x (100 - Yeast Attenuation %)|- Original Gravity Points expressed as Gravity Points, not Specific Gravity e.g. 59 Points <br>- Final Gravity expressed as Gravity Points e.g. 15. To convert to Specfic Gravity, divide by 1000 and then add 1 <br>- This Final Gravity calculation is a product of the Original Gravity and Yeast Attenuation only. It does not take any other relevant factors like fermentation temperature, amount of yeast pitched, yeast health, oxygen levels, mash temperature, adjunct quantities, nutrient levels in the wort, or flocculation rate of the yeast strain. Accordingly, this formula is never expected to return a Final Gravity lower than 1.000 (which is expected for certain styles) |
|ABV %|(Original Gravity - Final Gravity) x 131.25 |- Original Gravity and Final Gravity expressed as Specific Gravity e.g. 1.059 <br>- This is a general ABV formula. Many brewers online have pointed out that this formula becomes less accurate for higher gravity beers.|
|Gravity Points|(PPG x 8.3454) x Malt Quantity / Batch Size|- Gravity Points for each Malt <br>- To convert Points Per Pound Per Gallon (PPG) to a value that is compatible with Malt Quantity in Kilograms and Batch Size in Litres, multiply PPG by 8.3454 <br>- Malt Quantity expressed in Kilograms <br>- Batch Size expressed in Litres <br>- Gravity Points expressed as number of Points, not Specific Gravity - e.g. 50, not 1.050|
|Malt Color Units|(Lovibond x 8.3454) x Malt Quantity x Batch Size|- Malt Color Units for each Malt <br>- To convert Lovibond to a value that is compatible with Malt Quantity in Kilograms and Batch Size in Litres, multiply Lovibond by 8.3454 <br>- Malt Quantity expressed in Kilograms <br>- Batch Size expressed in Litres|
|Standard Research Measure (Color)|(Malt MCU ^ 0.6859) x 1.4922|- This is the Morey formula <br>- To calculate the total SRM for the whole grain bill, apply this formula to the sum of all Malt MCU values (do not add individual Malt SRM values)|
|Alpha Acid Units|Hop Quantity x Hop Alpha Acid %|- This formula is typically used with Hop Quantity expressed in ounces, however it's fine to use with Hop Quantity expressed in grams. Alpha Acid Units are typically used to adjust Hop Quantity when the Alpha Acid % is different from the Alpha Acid % stated on the Recipe|

## Dates
Dates are used in the context of tracking when recipes were created and last modified, and will also be used in future functionality involving brew timelines and monitoring. Dates are stored in the database in UTC and converted to the user's locale in EJS templates.
