// --------------------------
// TO DO
// - refactor functions below to use event listener, instead of html onclick
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
          <input id="maltName[${i}]" class="form-control form-control-sm border-0" type="text" name="malts[${i}][name]" value="New Malt">
        </td>
        <td>
          <label class="sr-only" for="maltQty[${i}]">Qty (kg)</label>
          <input id="maltQty[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.001" name="malts[${i}][qty]" value="0">
        </td>
        <td>
          <label class="sr-only" for="maltPPG[${i}]">PPG</label>
          <input id="maltPPG[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][ppg]" value="0">
        </td>
        <td>
          <label class="sr-only" for="maltGravityPoints[${i}]">Points</label>
          <input id="maltGravityPoints[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][gravityPoints]" value="0">
        </td>
        <td>
          <label class="sr-only" for="maltSRMLBG[${i}]">SRM/lb/G</label>
          <input id="maltSRMLBG[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][srmlbg]" value="0">
        </td>
        <td>
          <label class="sr-only" for="maltMCU[${i}]">MCU</label>
          <input id="maltMCU[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][mcu]" value="0">
        </td>
        <td>
          <label class="sr-only" for="maltSRM[${i}]">SRM</label>
          <input id="maltSRM[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="malts[${i}][srm]" value="0">
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
        $(this).find("input[id^=maltSRMLBG\\[]").attr("name", `malts[${i}][srmlbg]`);
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
          <input id="hopName[${i}]" class="form-control form-control-sm border-0" type="text" name="hops[${i}][name]" value="New Hop">  
        </td>
        <td>
          <label class="sr-only" for="hopAA[${i}]">AA%</label>
          <input id="hopAA[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" max="100" step="0.01" name="hops[${i}][aa]" value="0">  
        </td>
        <td>
          <label class="sr-only" for="hopQty[${i}]">Qty (g)</label>
          <input id="hopQty[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="hops[${i}][qty]" value="0">  
        </td>
        <td>
          <label class="sr-only" for="hopAAU[${i}]">AAU</label>
          <input id="hopAAU[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="hops[${i}][aau]" value="0">  
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
          <input id="hopTime[${i}]" class="form-control form-control-sm border-0 text-center" type="text" name="hops[${i}][time]" value="0">
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
        $(this).find("input[id^=hopTime\\[]").attr("name", `hops[${i}][time]`);
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
          <label class="sr-only" for="finingsType[${i}]">Type</label>
          <input id="finingsType[${i}]" class="form-control form-control-sm border-0" type="text" name="finings[${i}][type]" value="New Fining">  
        </td>
        <td>
          <label class="sr-only" for="finingsQty[${i}]">Qty</label>
          <input id="finingsQty[${i}]" class="form-control form-control-sm border-0 text-center" type="text" name="finings[${i}][qty]" value="0">  
        </td>
        <td>
          <label class="sr-only" for="finingsTiming[${i}]">Timing</label>
          <input id="finingsTiming[${i}]" class="form-control form-control-sm border-0 text-left" type="text" name="finings[${i}][timing]" value="New Fining Timing">  
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
                $(this).find("label[for^=finingsType\\[]").attr("for", `finingsType[${i}]`);
                $(this).find("input[id^=finingsType\\[]").attr("id", `finingsType[${i}]`);
                $(this).find("input[id^=finingsType\\[]").attr("name", `finings[${i}][type]`);
                // finings qty - label for attribute, input id & name attributes
                $(this).find("label[for^=finingsQty\\[]").attr("for", `finingsQty[${i}]`);
                $(this).find("input[id^=finingsQty\\[]").attr("id", `finingsQty[${i}]`);
                $(this).find("input[id^=finingsQty\\[]").attr("name", `finings[${i}][qty]`);
                // hop qty - label for attribute, input id & name attributes
                $(this).find("label[for^=finingsTiming\\[]").attr("for", `finingsTiming[${i}]`);
                $(this).find("input[id^=finingsTiming\\[]").attr("id", `finingsTiming[${i}]`);
                $(this).find("input[id^=finingsTiming\\[]").attr("name", `finings[${i}][timing]`);
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
      <input id="mashRestType[${i}]" class="form-control form-control-sm border-0" type="text" name="mashSched[${i}][restType]" value="New Rest">  
    </td>
    <td>
      <label class="sr-only" for="mashTemp[${i}]">Temp (C)</label>
      <input id="mashTemp[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="mashSched[${i}][mashTemp]" value="0">  
    </td>
    <td>
      <label class="sr-only" for="mashMins[${i}]">Minutes</label>
      <input id="mashMins[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="1" name="mashSched[${i}][mashMins]" value="0">  
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
				$(this).find("input[id^=mashTemp\\[]").attr("name", `mashSched[${i}][mashTemp]`);
        // mash mins - label for attribute, input id & name attributes
				$(this).find("label[for^=mashMins\\[]").attr("for", `mashMins[${i}]`);
				$(this).find("input[id^=mashMins\\[]").attr("id", `mashMins[${i}]`);
				$(this).find("input[id^=mashMins\\[]").attr("name", `mashSched[${i}][mashMins]`);
				// increment i
				i++;
			});
		});
	});
});

// show/hide-reset yeast prep details
$("input[name=recipe\\[yeastPrep\\]]").change(function() {
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

// show/hide-reset mash out temp and mash out water row
$("input[name=recipe\\[mashOut\\]]").change(function() {
  let val = $(this).val() === "true" ? true : false;
  let hidden = $("#mashOut-col").hasClass("d-none");
  if ((val === true) && (hidden === true)) {
    $("#mashOut-col").toggleClass("d-none")
    $("#mashOut-row").toggleClass("d-none")
  } 
  else if ((val === false) && (hidden === false)) {
    $("#mashOut-col").toggleClass("d-none");
    $("#mashOut-row").toggleClass("d-none");
  }

});

// show/hide-reset water adjustment details
$("input[name=recipe\\[waterAdjust\\]]").change(function() {
  let val = $(this).val() === "true" ? true : false;
  let hidden = $("#waterAdjustDesc-row").hasClass("d-none");
  if ((val === true) && (hidden === true)) {
    $("#waterAdjustDesc-row").toggleClass("d-none")
  } 
  else if ((val === false) && (hidden === false)) {
    $("#waterAdjustDesc-row").toggleClass("d-none")
    $("#waterAdjustDesc").val("");
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
        <input id="fermStage[${i}]" class="form-control form-control-sm border-0" type="text" name="fermSched[${i}][stage]" value="New Stage">  
      </td>
      <td>
        <label class="sr-only" for="fermTemp[${i}]">Temp (C)</label>
        <input id="fermTemp[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="0.01" name="fermSched[${i}][fermTemp]" value="0">  
      </td>
      <td>
        <label class="sr-only" for="fermDays[${i}]">Days</label>
        <input id="fermDays[${i}]" class="form-control form-control-sm border-0 text-center" type="number" min="0" step="1" name="fermSched[${i}][fermDays]" value="0">  
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
				$(this).find("input[id^=fermStage\\[]").attr("name", `fermSched[${i}][stage]`);
        // ferm temp - label for attribute, input id & name attributes
				$(this).find("label[for^=fermTemp\\[]").attr("for", `fermTemp[${i}]`);
				$(this).find("input[id^=fermTemp\\[]").attr("id", `fermTemp[${i}]`);
				$(this).find("input[id^=fermTemp\\[]").attr("name", `fermSched[${i}][fermTemp]`);
        // ferm days - label for attribute, input id & name attributes
				$(this).find("label[for^=fermDays\\[]").attr("for", `fermDays[${i}]`);
				$(this).find("input[id^=fermDays\\[]").attr("id", `fermDays[${i}]`);
				$(this).find("input[id^=fermDays\\[]").attr("name", `fermSched[${i}][fermDays]`);
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
      <textarea id="noteDetails[${i}]" class="form-control form-control-sm border-0" name="notes[${i}][details]" rows="2">New Recipe Note</textarea>
    </td>
    <td class="border-0">
      <a class="btn btn-sm btn-outline-dark my-1 delete-notes" role="button"><i class="far fa-trash-alt"></i></i></a>
    </td> 
    </tr>`
  );
});

// delete rows from ferm schedule table
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

let uom = "metric";