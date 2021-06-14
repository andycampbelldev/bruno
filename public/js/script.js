// --------------------------
// TO DO
// - refactor functions below to use event listener, instead of html onclick
// - separate out water calculation logic into separate script
// - standardize with use of either jQuery or vanilla JS
// --------------------------

//general toggler for showing/hiding elements
function toggler(i) {
    $("." + i).toggleClass("d-none");
}

//show new general note
function newNote() {
    if ($(".new-note").hasClass("d-none") === true) {
        $(".new-note").toggleClass("d-none");
    }
    $("#notesTitle").val("");
    $("#notesOther").val("");
    $("#note-template-content").remove();
    $("#notesImage").val("");
    $("#notesImage").next(".custom-file-label").html("Choose a file");
}

//show new note template
function noteTemplate(title) {
    let id = title.replace(/ /g, "-").toLowerCase();
    if ($(".new-note").hasClass("d-none") === true) {
        $(".new-note").toggleClass("d-none");
    }
    $("#notesTitle").val(title);
    $("#note-template-content").remove();
    $(".note-template-content").append(
        `<div id="note-template-content" class="form-group row my-1">
            <label for="note-template-${id}" class="col-sm-2 col-form-label-sm">${title}</label>
            <div class="col-sm-10">
                <input id="note-template-${id}" class="form-control form-control-sm bottom-border" type="text" name="notes[note-template-${id}]"></input>
            </div>
        </div>`
    );
    $("#note-template-" + id).focus();
    $("#note-template-" + id).change(function() {
        if ($(this).val().length > 0) {
            $('#notesTitle').val(title + " - " + $(this).val());
        } else {
            $('#notesTitle').val(title);
        }
    });    
}

//for note templates add the template value to the note title and body
$('input[name="name"]').change(function() {
    $('input[name="firstname"]').val($(this).val());
});

//show name of uploaded image in new note form
$("#notesImage").change(function(e){
    let fileName = e.target.files[0].name;
    $(this).next(".custom-file-label").html(fileName);
});

//cancel new note
function cancelNewNote() {
    newNote();
    $(".new-note").toggleClass("d-none");
}

//flag photo for deletion on note edit save
function deletePhoto(i) {
    if ($("#deletePhoto-" + i).prop("checked")) {
        $("#deletePhoto-" + i).prop("checked", false);
        $("#thumb-" + i).toggleClass("photo-delete")
    } else {
        $("#deletePhoto-" + i).prop("checked", true);
        $("#thumb-" + i).toggleClass("photo-delete")
    }
}

// add more rows to malt table as needed
$("#malt-table").on("click", ".add-malt", function() {
  // check the number of malt-rows already on the page. Use the result as the index for the row being added.
  let i = $(".malt-row").length;
	$("#malt-list").append(
        `<tr class="malt-row">
        <td>
          <label class="sr-only" for="maltName[${i}]">Name</label>
          <input id="maltName[${i}]" class="form-control form-control-sm border-0" type="text" name="malts[${i}][name]" placeholder="New Malt">
        </td>
        <td>
          <label class="sr-only" for="maltQty[${i}]">Qty (kg)</label>
          <input id="maltQty[${i}]" class="form-control form-control-sm border-0 text-center maltQty" type="number" min="0" step="0.001" name="malts[${i}][qty]">
        </td>
        <td>
          <label class="sr-only" for="maltPPG[${i}]">PPG</label>
          <input id="maltPPG[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][ppg]">
        </td>
        <td>
          <label class="sr-only" for="maltGravityPoints[${i}]">Points</label>
          <input id="maltGravityPoints[${i}]" class="form-control form-control-sm border-0 text-center d-none" type="number" min="0" step="0.01" name="malts[${i}][gravityPoints]">
          <span id="maltGravityPointsDisplay[${i}]" class="d-block form-control-sm text-center bold">0</span>
        </td>
        <td>
          <label class="sr-only" for="maltSRMLBG[${i}]">SRM/lb/G</label>
          <input id="maltSRMLBG[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][srmLbG]">
        </td>
        <td>
          <label class="sr-only" for="maltMCU[${i}]">MCU</label>
          <input id="maltMCU[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][mcu]">
        </td>
        <td>
          <label class="sr-only" for="maltSRM[${i}]">SRM</label>
          <input id="maltSRM[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][srm]">
        </td>
        <td class="border-0">
          <a class="btn btn-sm btn-outline-dark my-1 delete-malt" role="button"><i class="far fa-trash-alt"></i></i></a>
        </td>
      </tr>`
    );
});

// delete rows from malt table
$("#malt-table").on("click", ".delete-malt", function() {
	$(this).parents(".malt-row").fadeOut(50, function() {
		$.when($(this).remove()).then(function() {
			// loop over the remaining malt rows and resequence to avoid index conflicts
			let i = 0;
			$(".malt-row").each(function(){
				// malt name - label for attribute, input id & name attributes
				$(this).find("label[for^=maltName\\[]").attr("for", `maltName[${i}]`);
				$(this).find("input[id^=maltName\\[]").attr("id", `maltName[${i}]`);
				$(this).find("input[id^=maltName\\[]").attr("name", `malts[${i}][name]`);
				// malt qty - label for attribute, input id & name attributes
				$(this).find("label[for^=maltQty\\[]").attr("for", `maltQty[${i}]`);
				$(this).find("input[id^=maltQty\\[]").attr("id", `maltQty[${i}]`);
				$(this).find("input[id^=maltQty\\[]").attr("name", `malts[${i}][qty]`);
				// malt ppg - label for attribute, input id & name attributes
				$(this).find("label[for^=maltPPG\\[]").attr("for", `maltPPG[${i}]`);
				$(this).find("input[id^=maltPPG\\[]").attr("id", `maltPPG[${i}]`);
				$(this).find("input[id^=maltPPG\\[]").attr("name", `malts[${i}][ppg]`);
				// malt points - label for attribute, input id & name attributes
				$(this).find("label[for^=maltGravityPoints\\[]").attr("for", `maltGravityPoints[${i}]`);
				$(this).find("input[id^=maltGravityPoints\\[]").attr("id", `maltGravityPoints[${i}]`);
        $(this).find("input[id^=maltGravityPoints\\[]").attr("name", `malts[${i}][gravityPoints]`);
        // malt srm/lb/g - label for attribute, input id & name attributes
        $(this).find("label[for^=maltSRMLBG\\[]").attr("for", `maltSRMLBG[${i}]`);
				$(this).find("input[id^=maltSRMLBG\\[]").attr("id", `maltSRMLBG[${i}]`);
        $(this).find("input[id^=maltSRMLBG\\[]").attr("name", `malts[${i}][srmLbG]`);
        // malt mcu - label for attribute, input id & name attributes
        $(this).find("label[for^=maltMCU\\[]").attr("for", `maltMCU[${i}]`);
				$(this).find("input[id^=maltMCU\\[]").attr("id", `maltMCU[${i}]`);
        $(this).find("input[id^=maltMCU\\[]").attr("name", `malts[${i}][mcu]`);
        // malt total srm - label for attribute, input id & name attributes
        $(this).find("label[for^=maltSRM\\[]").attr("for", `maltSRM[${i}]`);
				$(this).find("input[id^=maltSRM\\[]").attr("id", `maltSRM[${i}]`);
        $(this).find("input[id^=maltSRM\\[]").attr("name", `malts[${i}][srm]`);
				// increment i
				i++;
			});
		});
	});
});

// add more rows to hop table as needed
$("#hop-table").on("click", ".add-hop", function() {
  // check the number of hop-rows already on the page. Use the result as the index for the row being added.
  let i = $(".hop-row").length;
	$("#hop-list").append(
        `<tr class="hop-row">
        <td>
          <label class="sr-only" for="hopName[${i}]">Name</label>
          <input id="hopName[${i}]" class="form-control form-control-sm border-0" type="text" name="hops[${i}][name]" placeholder="New Hop">  
        </td>
        <td>
          <label class="sr-only" for="hopAA[${i}]">AA%</label>
          <input id="hopAA[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" max="100" step="0.01" name="hops[${i}][aa]">  
        </td>
        <td>
          <label class="sr-only" for="hopQty[${i}]">Qty (g)</label>
          <input id="hopQty[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="hops[${i}][qty]">  
        </td>
        <td>
          <label class="sr-only" for="hopAAU[${i}]">AAU</label>
          <input id="hopAAU[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="hops[${i}][aau]">  
        </td>
        <td class="text-center">
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-light active">
              <input type="radio" name="hops[${i}][usage]" id="boil" autocomplete="off" value="Boil" checked>Boil
            </label>
            <label class="btn btn-light">
              <input type="radio" name="hops[${i}][usage]" id="dry" autocomplete="off" value="Dry">Dry
            </label>
          </div>
        </td>
        <td>
          <label class="sr-only" for="hopTime[${i}]">Timing</label>
          <input id="hopTime[${i}]" class="form-control form-control-sm border-0 text-center" type="text" name="hops[${i}][timing]">
        </td>
        <td class="border-0">
          <a class="btn btn-sm btn-outline-dark my-1 delete-hop" role="button"><i class="far fa-trash-alt"></i></i></a>
        </td>      
      </tr>`
    );
});

// delete rows from hop table
$("#hop-table").on("click", ".delete-hop", function() {
	$(this).parents(".hop-row").fadeOut(50, function() {
		$.when($(this).remove()).then(function() {
			// loop over the remaining hop rows and resequence to avoid index conflicts
			let i = 0;
			$(".hop-row").each(function(){
        // hop name - label for attribute, input id & name attributes
				$(this).find("label[for^=hopName\\[]").attr("for", `hopName[${i}]`);
				$(this).find("input[id^=hopName\\[]").attr("id", `hopName[${i}]`);
				$(this).find("input[id^=hopName\\[]").attr("name", `hops[${i}][name]`);
				// hop aa% - label for attribute, input id & name attributes
				$(this).find("label[for^=hopAA\\[]").attr("for", `hopAA[${i}]`);
				$(this).find("input[id^=hopAA\\[]").attr("id", `hopAA[${i}]`);
				$(this).find("input[id^=hopAA\\[]").attr("name", `hops[${i}][aa]`);
				// hop qty - label for attribute, input id & name attributes
				$(this).find("label[for^=hopQty\\[]").attr("for", `hopQty[${i}]`);
				$(this).find("input[id^=hopQty\\[]").attr("id", `hopQty[${i}]`);
				$(this).find("input[id^=hopQty\\[]").attr("name", `hops[${i}][qty]`);
				// hop aau - label for attribute, input id & name attributes
				$(this).find("label[for^=hopAAU\\[]").attr("for", `hopAAU[${i}]`);
				$(this).find("input[id^=hopAAU\\[]").attr("id", `hopAAU[${i}]`);
        $(this).find("input[id^=hopAAU\\[]").attr("name", `hops[${i}][aau]`);
        // hop usage - input name attribute
        $(this).find("input[name$=\\[usage\\]]").attr("name", `hops[${i}][usage]`);
        // hop time - label for attribute, input id & name attributes
        $(this).find("label[for^=hopTime\\[]").attr("for", `hopTime[${i}]`);
				$(this).find("input[id^=hopTime\\[]").attr("id", `hopTime[${i}]`);
        $(this).find("input[id^=hopTime\\[]").attr("name", `hops[${i}][timing]`);
				// increment i
				i++;
			});
		});
	});
});

// add more rows to finings table as needed
$("#finings-table").on("click", ".add-finings", function() {
  // check the number of finings-rows already on the page. Use the result as the index for the row being added.
  let i = $(".finings-row").length;
    $("#finings-list").append(
        `<tr class="finings-row">
        <td>
          <label class="sr-only" for="finingsName[${i}]">Type</label>
          <input id="finingsName[${i}]" class="form-control form-control-sm border-0" type="text" name="finings[${i}][name]" placeholder="New Fining">  
        </td>
        <td>
          <label class="sr-only" for="finingsQty[${i}]">Qty</label>
          <input id="finingsQty[${i}]" class="form-control form-control-sm border-0 text-center" type="text" name="finings[${i}][qty]">  
        </td>
        <td>
          <label class="sr-only" for="finingsUsage[${i}]">Usage</label>
          <input id="finingsUsage[${i}]" class="form-control form-control-sm border-0 text-left" type="text" name="finings[${i}][usage]">  
        </td>
        <td class="border-0">
          <a class="btn btn-sm btn-outline-dark my-1 delete-finings" role="button"><i class="far fa-trash-alt"></i></i></a>
        </td> 
      </tr>`
    );
});

// delete rows from finings table
$("#finings-table").on("click", ".delete-finings", function() {
    $(this).parents(".finings-row").fadeOut(50, function() {
        $.when($(this).remove()).then(function() {
            // loop over the remaining hop rows and resequence to avoid index conflicts
            let i = 0;
            $(".finings-row").each(function(){
                // finings type - label for attribute, input id & name attributes
                $(this).find("label[for^=finingsName\\[]").attr("for", `finingsName[${i}]`);
                $(this).find("input[id^=finingsName\\[]").attr("id", `finingsName[${i}]`);
                $(this).find("input[id^=finingsName\\[]").attr("name", `finings[${i}][name]`);
                // finings qty - label for attribute, input id & name attributes
                $(this).find("label[for^=finingsQty\\[]").attr("for", `finingsQty[${i}]`);
                $(this).find("input[id^=finingsQty\\[]").attr("id", `finingsQty[${i}]`);
                $(this).find("input[id^=finingsQty\\[]").attr("name", `finings[${i}][qty]`);
                // hop qty - label for attribute, input id & name attributes
                $(this).find("label[for^=finingsUsage\\[]").attr("for", `finingsUsage[${i}]`);
                $(this).find("input[id^=finingsUsage\\[]").attr("id", `finingsUsage[${i}]`);
                $(this).find("input[id^=finingsUsage\\[]").attr("name", `finings[${i}][usage]`);
                // increment i
                i++;
            });
        });
    });
});

// add more rows to mash schedule table as needed
$("#mash-table").on("click", ".add-mash", function() {
  // check the number of mash-rows already on the page. Use the result as the index for the row being added.
  let i = $(".mash-row").length;
  $("#mash-list").append(
    `<tr class="mash-row">
    <td>
      <label class="sr-only" for="mashRestType[${i}]">Rest Type</label>
      <input id="mashRestType[${i}]" class="form-control form-control-sm border-0" type="text" name="mashSched[${i}][restType]" placeholder="New Rest">  
    </td>
    <td>
      <label class="sr-only" for="mashTemp[${i}]">Temp (C)</label>
      <input id="mashTemp[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="mashSched[${i}][temp]">  
    </td>
    <td>
      <label class="sr-only" for="mashMins[${i}]">Minutes</label>
      <input id="mashMins[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="1" name="mashSched[${i}][minutes]">  
    </td>
    <td class="border-0">
      <a class="btn btn-sm btn-outline-dark my-1 delete-mash" role="button"><i class="far fa-trash-alt"></i></i></a>
    </td> 
  </tr>`
  );
});

// delete rows from mash schedule table
$("#mash-table").on("click", ".delete-mash", function() {
	$(this).parents(".mash-row").fadeOut(50, function() {
		$.when($(this).remove()).then(function() {
			// loop over the remaining mash rows and resequence to avoid index conflicts
			let i = 0;
			$(".mash-row").each(function(){
        // rest type - label for attribute, input id & name attributes
        $(this).find("label[for^=mashRestType\\[]").attr("for", `mashRestType[${i}]`);
				$(this).find("input[id^=mashRestType\\[]").attr("id", `mashRestType[${i}]`);
				$(this).find("input[id^=mashRestType\\[]").attr("name", `mashSched[${i}][restType]`);
        // mash temp - label for attribute, input id & name attributes
				$(this).find("label[for^=mashTemp\\[]").attr("for", `mashTemp[${i}]`);
				$(this).find("input[id^=mashTemp\\[]").attr("id", `mashTemp[${i}]`);
				$(this).find("input[id^=mashTemp\\[]").attr("name", `mashSched[${i}][temp]`);
        // mash mins - label for attribute, input id & name attributes
				$(this).find("label[for^=mashMins\\[]").attr("for", `mashMins[${i}]`);
				$(this).find("input[id^=mashMins\\[]").attr("id", `mashMins[${i}]`);
				$(this).find("input[id^=mashMins\\[]").attr("name", `mashSched[${i}][minutes]`);
				// increment i
				i++;
			});
		});
	});
});

// show/hide-reset yeast prep details
$("input[name=yeast\\[starter\\]]").change(function() {
  let val = $(this).val() === "true" ? true : false;
  let hidden = $("#yeastPrepDesc-row").hasClass("d-none");
  if ((val === true) && (hidden === true)) {
    $("#yeastPrepDesc-row").toggleClass("d-none")
  } 
  else if ((val === false) && (hidden === false)) {
    $("#yeastPrepDesc-row").toggleClass("d-none")
    $("#yeastPrepDesc").val("");
  }
});

// // show/hide-reset mash out temp and mash out water row
// $("input[name=mash\\[mashOut\\]]").change(function() {
//   let val = $(this).val() === "true" ? true : false;
//   let hidden = $("#mashOut-row").hasClass("d-none");
//   if ((val === true) && (hidden === true)) {
//     $("#mashOut-row").toggleClass("d-none")
//   } 
//   else if ((val === false) && (hidden === false)) {
//     $("#mashOut-row").toggleClass("d-none");
//   }
// });

// show/hide-reset water adjustment details
$("input[name=water\\[adjustments\\]]").change(function() {
  let val = $(this).val() === "true" ? true : false;
  let hidden = $("#waterAdjustmentNotes-row").hasClass("d-none");
  if ((val === true) && (hidden === true)) {
    $("#waterAdjustmentNotes-row").toggleClass("d-none")
  } 
  else if ((val === false) && (hidden === false)) {
    $("#waterAdjustmentNotes-row").toggleClass("d-none")
    $("#waterAdjustmentNotes").val("");
  }
});

// initialize all popovers and contain within the water table
const popoverContainer = document.querySelector('#water-table');
$('[data-toggle="popover"]').popover({
  boundary: "viewport"
});

// add more rows to ferm schedule table as needed
$("#ferm-table").on("click", ".add-ferm", function() {
  // check the number of mash-rows already on the page. Use the result as the index for the row being added.
  let i = $(".ferm-row").length;
  $("#ferm-list").append(
    `<tr class="ferm-row">
      <td>
        <label class="sr-only" for="fermStage[${i}]">Stage</label>
        <input id="fermStage[${i}]" class="form-control form-control-sm border-0" type="text" name="ferm[${i}][stage]" placeholder="New Stage">  
      </td>
      <td>
        <label class="sr-only" for="fermTemp[${i}]">Temp (C)</label>
        <input id="fermTemp[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="ferm[${i}][temp]">  
      </td>
      <td>
        <label class="sr-only" for="fermDays[${i}]">Days</label>
        <input id="fermDays[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="1" name="ferm[${i}][days]">  
      </td>
      <td class="border-0">
        <a class="btn btn-sm btn-outline-dark my-1 delete-ferm" role="button"><i class="far fa-trash-alt"></i></i></a>
      </td> 
    </tr>`
  );
});

// delete rows from ferm schedule table
$("#ferm-table").on("click", ".delete-ferm", function() {
	$(this).parents(".ferm-row").fadeOut(50, function() {
		$.when($(this).remove()).then(function() {
			// loop over the remaining mash rows and resequence to avoid index conflicts
			let i = 0;
			$(".ferm-row").each(function(){
        // stage - label for attribute, input id & name attributes
        $(this).find("label[for^=fermStage\\[]").attr("for", `fermStage[${i}]`);
				$(this).find("input[id^=fermStage\\[]").attr("id", `fermStage[${i}]`);
				$(this).find("input[id^=fermStage\\[]").attr("name", `ferm[${i}][stage]`);
        // ferm temp - label for attribute, input id & name attributes
				$(this).find("label[for^=fermTemp\\[]").attr("for", `fermTemp[${i}]`);
				$(this).find("input[id^=fermTemp\\[]").attr("id", `fermTemp[${i}]`);
				$(this).find("input[id^=fermTemp\\[]").attr("name", `ferm[${i}][temp]`);
        // ferm days - label for attribute, input id & name attributes
				$(this).find("label[for^=fermDays\\[]").attr("for", `fermDays[${i}]`);
				$(this).find("input[id^=fermDays\\[]").attr("id", `fermDays[${i}]`);
				$(this).find("input[id^=fermDays\\[]").attr("name", `ferm[${i}][days]`);
				// increment i
				i++;
			});
		});
	});
});

// add more rows to additional notes table as needed
$("#notes-table").on("click", ".add-notes", function() {
  // check the number of note-rows already on the page. Use the result as the index for the row being added.
  let i = $(".notes-row").length;
  $("#notes-list").append(
    `<tr class="notes-row">
    <td>
      <label class="sr-only" for="noteDetails[${i}]">Details</label>
      <textarea id="noteDetails[${i}]" class="form-control form-control-sm border-0" name="recipeNotes[${i}]" rows="2" placeholder="New Recipe Note"></textarea>
    </td>
    <td class="border-0">
      <a class="btn btn-sm btn-outline-dark my-1 delete-notes" role="button"><i class="far fa-trash-alt"></i></i></a>
    </td> 
    </tr>`
  );
});

// delete rows from additional notes table
$("#notes-table").on("click", ".delete-notes", function() {
	$(this).parents(".notes-row").fadeOut(50, function() {
		$.when($(this).remove()).then(function() {
			// loop over the remaining mash rows and resequence to avoid index conflicts
			let i = 0;
			$(".notes-row").each(function(){
        // details - label for attribute, input id & name attributes
        $(this).find("label[for^=noteDetails\\[]").attr("for", `noteDetails[${i}]`);
				$(this).find("textarea[id^=noteDetails\\[]").attr("id", `noteDetails[${i}]`);
				$(this).find("textarea[id^=noteDetails\\[]").attr("name", `notes[${i}][details]`);
				// increment i
				i++;
			});
		});
	});
});

// populate recipe brewhouse volume settings from selected brewhouse. Store the Brewhouse Mash Conversion Percent on the recipe object
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
       //run water calculater
      recipe.calculateWater();
    })
  }
});

// calculations
// when certain fields change, we'll need to be prepared to update/recalculate other fields.
// There is going to be a lot to keep track of. We'll use an object called recipe to capture
//  values as they change, and call functions as necessary.

let recipe = {
  inputs: {},
  outputs: {}
}

// sum all values from all inputs with the specified class
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

recipe.getInputs = async function() {
  this.inputs.batchSize = parseFloat(document.querySelector('#batchSize').value || 0);
  this.inputs.boilMinutes = parseFloat(document.querySelector('#boilMinutes').value || 0);
  this.inputs.boilOffRate = parseFloat(document.querySelector('#boilOffRate').value || 0);
  this.inputs.grainAbsorptionRate = parseFloat(document.querySelector('#grainAbsorptionRate').value || 0);
  this.inputs.gristRatio = parseFloat(document.querySelector('#gristRatio').value || 0);
  this.inputs.kettleLoss = parseFloat(document.querySelector('#kettleLoss').value || 0);
  this.inputs.targetABV = parseFloat(document.querySelector('#targetABV').value || 0);
  this.inputs.targetFG = parseFloat(document.querySelector('#targetFG').value || 0);
  this.inputs.targetOG = parseFloat(document.querySelector('#targetOG').value || 0);
  this.inputs.maltQtyTotal = parseFloat(document.querySelector('#maltTotalsQtyInput').value || 0);
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
  this.inputs.mashOutTargetTemp = parseFloat(document.querySelector('#mashOutTargetTemp').value || 0);
  this.inputs.mashOutWaterTemp = parseFloat(document.querySelector('#mashOutWaterTemp').value || 0);
  this.inputs.mashHeatLoss = parseFloat(document.querySelector('#mashHeatLoss').value || 0);
  this.inputs.grainSpecificHeat = parseFloat(document.querySelector('#grainSpecificHeat').value || 0);
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

  // //mash out volume inputs and result
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

recipe.calculateWater = async function() {
  await this.getInputs();
  //+ boil-off
  this.outputs.boilOffVolume = parseFloat((this.inputs.boilOffRate * (this.inputs.boilMinutes/60)).toFixed(2));
  // = pre-boil volume
  this.outputs.preBoilVolume = parseFloat((this.inputs.batchSize + this.inputs.kettleLoss + this.outputs.boilOffVolume).toFixed(2));
  // + grain loss
  this.outputs.grainAbsorptionVolume = parseFloat((this.inputs.maltQtyTotal * this.inputs.grainAbsorptionRate).toFixed(2));
  // = total mash water
  this.outputs.totalMashWaterVolume = parseFloat((this.outputs.preBoilVolume + this.outputs.grainAbsorptionVolume).toFixed(2));
  // strike water volume
  this.outputs.strikeWaterVolume = parseFloat((this.inputs.gristRatio * this.inputs.maltQtyTotal).toFixed(2));
  // mash out water volume
  if(this.inputs.mashOut) {
    this.outputs.mashEndTemp = parseFloat((this.inputs.finalMashStepTemp - ((this.inputs.finalMashStepMinutes/60) * this.inputs.mashHeatLoss)).toFixed(2));
    this.outputs.mashOutVolume = parseFloat(((this.inputs.mashOutTargetTemp - this.outputs.mashEndTemp) * ((this.inputs.maltQtyTotal * this.inputs.grainSpecificHeat) + this.outputs.strikeWaterVolume)/(this.inputs.mashOutWaterTemp - this.inputs.mashOutTargetTemp)).toFixed(2));
  } else {
    this.outputs.mashOutVolume = 0;
  }
  // sparge water volume
  this.outputs.spargeWaterVolume = parseFloat((this.outputs.totalMashWaterVolume - (this.outputs.strikeWaterVolume + this.outputs.mashOutVolume)).toFixed(2));
  // output water results to the DOM
  recipe.outputWater();
}

// targets - on input, capture values on recipe object
document.querySelector('#target-container').addEventListener('input', (e) => {
   //run water calculater
   recipe.calculateWater();
})

// Brewhouse settings - on input, capture values on recipe object
document.querySelector('#brewhouse-container').addEventListener('input', (e) => {
   //run water calculater
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

// const mashOutRadios = document.querySelectorAll('#mashOutToggle input[type="radio"]');
// for (let i of mashOutRadios) {
//   i.addEventListener('click', () => {
//     console.log('Radio Clicked')
//     //run water calculater
//    //recipe.calculateWater();
//   })
// }

// malt table - listen for changes
document.querySelector('#malt-table-container').addEventListener('input', (e) => {
  // add up malt qty
  const totalMaltQty = recipe.sumValues('.maltQty');
  document.querySelector('#maltTotalsQtyDisplay').textContent = totalMaltQty;
  document.querySelector('#maltTotalsQtyInput').value = totalMaltQty;
  // calculate points for each malt
  // identify the parent row and get the relevant values
  const maltRow = e.target.parentElement.parentElement;
  const qty = parseFloat(maltRow.querySelector('input[id^="maltQty"]').value || 0);
  const ppg = parseFloat(maltRow.querySelector('input[id^="maltPPG"]').value || 0);
  // now we have the metric qty and pre boil volume, but the ppg is imperial.
  // convert ppg value to a metric value by multiplying by 8.3454
  const points = parseFloat(((ppg * 8.3454) * qty / recipe.outputs.preBoilVolume).toFixed(0));
  maltRow.querySelector('input[id^="maltGravityPoints"]').value = points;
  maltRow.querySelector('span[id^="maltGravityPointsDisplay"]').textContent = points;
  // add up all gravity points
  const totalGravityPoints = recipe.sumValues('input[id^="maltGravityPoints"]');
  document.querySelector('#maltTotalsPointsDisplay').textContent = totalGravityPoints;
  document.querySelector('#maltTotalsPointsInput').value = totalGravityPoints;
  //run water calculater
  recipe.calculateWater();
})

// mash table - listen for changes
document.querySelector('#mash-table-container').addEventListener('input', (e) => {
  //run water calculater
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

