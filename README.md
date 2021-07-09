This is just a temp read me to keep working notes handy for the initial build.

Currently building out EJS templates, which requires some demo data to be added, which closely models the actual schema that will be used when data persistence is implemented:

New Models will need to be fully documented at some point.

New Schema for organizing brews:
-   Beer (the goal) at the top level - has a name and style (e.g. Cascading Delete, APA)
    -   For each Beer, there must be a Recipe (the plan):
        -   Recipe is all the ingredients, volumes, temperatures, timings and other steps necessary to produce the Beer as it is ultimately intended. A given Recipe is specific to exactly one Beer.
        -   A Recipe can be copied:
            -   New Version: The copy can become a subsequent Version of the original Recipe (the original Recipe has a Version of 1).
            New Versions are given a version number, version date (the date the version was created), and a brief comment about what is intended to change from the source version being copied from.
        -   New Beer: The copy can also be assigned as the Version 1 Recipe for a new Beer.
        -   A Brew is an instance of a Recipe Version being brewed in an attempt to produce the Beer it is linked to. It's the execution of the plan to achieve the goal. 
            -   The Brew also takes into account the Brewhouse Profile and General Settings and combines these with the data on the Recipe to calculate water volume and temperature. 
            -   Water volume and temp requirements vary, depending on the equipment and brew day conditions, so it makes sense to have these separate from the recipe.

Schema:
- Beer - the name of the recipe, and style
- Recipe
- Brew (this is where we'll record actuals)
- Notes (these will also populate against the Brew). This will also include 
- Photos
- Brewhouse Profile
- General Settings


Unresolved legacy issues to watch out for:
Dates appeared to be captured and stored based on the eastern timezone. Could be related to AWS instance, but need to investigate this further and ensure dates are localized correctly.
Line breaks not observed in saved notes, making them hard to read. Need to determine if these were being lost on save and ensure this is resolved.

Notes to tidy up later:

From Recipe.js:
Add to README: Some general rules for calculations:
- water affects each malt, and gravity
- malt affects water (strike vol, grain loss) and gravity
- hops are currently standalone - just update totals
- mash affects water temp (not water volume though, so no need to re-run malt)
- yeast affects gravity
- ferm is standalone - just update totals

+ Add to README: ABV formula: This is just a general formula. Many brewers online have pointed out that this formula becomes less accurate for higher gravity beers, however I generally keep mine under 6% ABV, so not too worried.
+ Add to README: FG is a product of OG and Yeast Attenuation - it does not take any other factors into account, therefore the only way that the FG could ever be <1 would be if we entered a yeast attenuation greater than 100%, which we would not do. 
This is merely an estimate and can be lower or higher because there are many factors that affect the final gravity. These factors include fermentation temperature, amount of yeast pitched, the health of yeast, the amount of O2 present, mash temperature, the amount of adjuncts used, the amount of nutrients available in the wort, and the flocculation rate of the yeast strain.
