//
// poi.js
//
// POI create and view related functions
//
// Jarmo Mäkelä 2015-11-20
// demo v3
//


/* The click indicator offset values depend in the icon size */
var CLICK_INDICATOR_OFFSET_X = 13;
var CLICK_INDICATOR_OFFSET_Y = 13;
var CLICK_INDICATOR_ICON = "img/clickpoint.png";
var CLICK_ICON_SPACE = 10;

/* These two constants depend on the poi-icon size and shape. To be redefined
   if the poi-icon is changed. The center of the poi-icon bottom should point
   exactly to where the user has clicked. */
var POI_ICON_OFFSET_X = 16;
var POI_ICON_OFFSET_Y = 48;

/* Note POI offsets. Needed when the POI element location is calculated. */
var POI_STD_OFFSET_X = 12; 
var POI_STD_OFFSET_Y = 14; 


function createObsPoi() {

    var poiElem;
    var floorPlan;
    var iconLeft;
    var iconTop;
    var thisOffset;
    var createdId;   // Id of the new poi
    
    var newPoi = {
	    id: null,
	    POIType: "Obs",
	    floorPlanId: "",
	    locationX: 0,
	    locationY: 0,
	    data: "",
	    attachmentUrl: "",
	    sampleNbr: "",
	    analysis: "",
	    sampleInfo: "",
	    substance: ""
    };
    
    
    /* Change the save button and title text to indicate this is a new observation */
    document.getElementById("obsPoiTitle").innerHTML = "Uusi havainto";
    document.getElementById("obsPoiSave").innerHTML = "Tallenna";

	////// Store new POI to db
    /* Find out the coordinates on the floorplan image */
    thisOffset = $(document.getElementById("floorPlanImg")).offset();
    newPoi.locationX = coordConv.dispToFloor(
		thisOffset.left,
		uiState.getZoomLevel(), 
		uiState.getClickedX()); 
	newPoi.locationY = coordConv.dispToFloor(
		thisOffset.top,
		uiState.getZoomLevel(),  
		uiState.getClickedY());  
    
    /* Set the data items in the new poi */  
    newPoi.floorPlanId = uiState.getCurrentDoc(); 
    newPoi.data = document.getElementById("obsPoiText").value;
    newPoi.attachmentUrl = "";   // Attachment support not yet implemented
    newPoi.sampleNbr = document.getElementById("obsPoiNumber").value;
    newPoi.analysis = document.getElementById("obsPoiAnalysis").value;
    newPoi.sampleInfo = document.getElementById("obsPoiSampleInfo").value;
    newPoi.attachmentUrl = document.getElementById("obsPoiCapture").value;
    newPoi.substance = document.getElementById("obsPoiSubstance").value;
    
    /* Save the new poi item to the database */
    createdId = db.storePOI(newPoi);
    if (createdId === null) {
        alert("Internal error, createObsPoi()");
        return;
    }
    
	newPoi.id = createdId; 
	createObsPoiInDOM(newPoi); 
    clearObsPoiForm();
}


function createObsPoiInDOM(poi) {
	///// Store new POI in DOM and show it
    /* Create a new element and set it into its position */
    poiElem = document.createElement("img");
    poiElem.style.position = 'absolute';
    poiElem.src = "img/poi-obs.png";
    
    floorPlan = document.getElementById("mainView");
    floorPlan.appendChild(poiElem);

    /* Calculate the coordinates for the new poi. */
    iconLeft = uiState.getClickedX() - POI_ICON_OFFSET_X;
    iconTop = uiState.getClickedY() - POI_ICON_OFFSET_Y;
	$(poiElem).offset({top: iconTop, left: iconLeft});
	
  //  poiElem.style.display = "block";
  //  poiElem.style.visibility = "visible";
    
    var tapHammertime = new Hammer(poiElem);
    tapHammertime.on('tap', function(event) {
        showObsPoi(poi.id);
    });
    
    /* Set the onclick function, coordinates and other data of the poi element */
//  poiElem.setAttribute("onclick", "showObsPoi(" + createdId.toString() + ");");
    poiElem.className = "poiClass";
	poiElem.setAttribute("data-poiType", "Obs"); 
    poiElem.setAttribute("data-floorId", poi.floorPlanId);
    poiElem.setAttribute("data-locationXY",
        '{"X":"' + poi.locationX + '","Y":"' + poi.locationY + '"}');	
}

function obsPoiAddPhoto() {
    alert("Kamera-integraatio ei vielä toteutettu.");
}


function showObsPoi(id) {

    var poi;

    /* Change the save button and title text to indicate that
       an existing poi is opened */
    document.getElementById("obsPoiTitle").innerHTML = "Havainnon tiedot";
    document.getElementById("obsPoiSave").innerHTML = "Tallenna muutokset";
    
    /* Set a new onclick function for the Save button */
    document.getElementById("obsPoiSave").setAttribute(
        "onclick", "updateObsPoi(" + id + ");");
    
    $("#obsPoiPhoto").show();
    $('#obsPoiForm').modal('show');
    
    /* Get the poi data from the storage and show it */
    poi = db.getPOIById(id);
    document.getElementById("obsPoiText").value = poi.data;
    document.getElementById("obsPoiNumber").value = poi.sampleNbr;
    document.getElementById("obsPoiAnalysis").value = poi.analysis;
    document.getElementById("obsPoiSampleInfo").value = poi.sampleInfo;
    document.getElementById("obsPoiCapture").value = poi.attachmentUrl;
    document.getElementById("obsPoiSubstance").value = poi.substance;
    
    /* Show the attacment area only if a photo has been attached to the poi */
    if (poi.attachmentUrl == "") {
        $("#obsPoiPhoto").hide();
    }
    
}


function updateObsPoi(id) {

    var poi;
    var ret;
    
    poi = db.getPOIById(id);
    
    /* Get the updated data from the form */
    poi.data = document.getElementById("obsPoiText").value;
    poi.sampleNbr = document.getElementById("obsPoiNumber").value;
    poi.analysis = document.getElementById("obsPoiAnalysis").value;
    poi.sampleInfo = document.getElementById("obsPoiSampleInfo").value;
    poi.attachmentUrl = document.getElementById("obsPoiCapture").value;
    poi.substance = document.getElementById("obsPoiSubstance").value;
    
    /* Update the poi data in the storage */
    ret = db.updatePOI(poi);
    if (ret == null) {
        alert("Internal error, updateObsPoi()");
    }
    
    clearObsPoiForm();
    
    /* Set the default onclick function back for the Save button */
    // document.getElementById("obsPoiSave").setAttribute("onclick", "savePoi('Obs');");
}


/* Operations to be done when exiting the observation poi form */
function clearObsPoiForm() {

    /* Empty the input fields of the observation poi dialog */
    document.getElementById("obsPoiText").value = "";
    document.getElementById("obsPoiNumber").value = "";    
    document.getElementById("obsPoiAnalysis").value = "";
    document.getElementById("obsPoiSampleInfo").value = "";
    document.getElementById("obsPoiCapture").value = "";
    document.getElementById("obsPoiSubstance").value = "";
    
    /* Restore the default onclick function */
    document.getElementById("obsPoiSave").setAttribute(
        "onclick", "createObsPoi();");
    
    hideClickIndicator();
}


function poiAnalysisList() {
    alert("Näytetään analyysi-vaihtoehtoja");
}

function createNotePoiInDOM(poi) {
   /* Create a new poi element to the display. */
    poiElem = document.createElement("div");
    poiElem.style.visibility = "hidden";
    poiElem.style.position = "absolute";
    
    poiElem.innerHTML = poi.data; 
	poiElem.style.border = "1px solid black";
	poiElem.style.backgroundColor = "#EEDC31";
	poiElem.style.paddingTop = "2px";
	poiElem.style.paddingLeft = "4px";
	poiElem.style.paddingRight = "4px";
	poiElem.className = "poiClass";
    
	poiElem.setAttribute("data-poiType", "Note"); 
    poiElem.setAttribute("data-floorId", poi.floorPlanId);
    poiElem.setAttribute("data-locationXY",
        '{"X":"' + poi.locationX + '","Y":"' + poi.locationY + '"}');
    poiElem.setAttribute("onclick",
        "alert('Tähän toteutettaneen kontekstimenu (Poista, Siirrä)');");
    
    floorPlan = document.getElementById("mainView");
    floorPlan.appendChild(poiElem);
	
	/* Calculate the display coordinates for the poi element. */
    poiLeft = uiState.getClickedX() - POI_STD_OFFSET_X;
    poiTop = uiState.getClickedY() - POI_STD_OFFSET_Y; 
    $(poiElem).offset({top: poiTop, left: poiLeft});

    poiElem.style.display = "block";
    poiElem.style.visibility = "visible";   
}

function createNotePoi(str) {

    var poiLeft;
    var poiTop;
    var thisOffset;
    var createdId;
    var poiElem;
    var floorPlan; 
    var newPoi = {
	    id: null,
	    POIType: "Note",
	    floorPlanId: "",
	    locationX: 0,
	    locationY: 0,
	    data: "" };
    
    /* Set the poi coordinates relative to the floorplan */
    thisOffset = $(document.getElementById("floorPlanImg")).offset();
    newPoi.locationX = coordConv.dispToFloor(
		thisOffset.left,
		uiState.getZoomLevel(), 
		uiState.getClickedX()); 
	newPoi.locationY = coordConv.dispToFloor(
		thisOffset.top,
		uiState.getZoomLevel(),  
		uiState.getClickedY());
		
	/* Set the other data items in the new poi */
	newPoi.floorPlanId = uiState.getCurrentDoc();
	newPoi.data = str;

    /* Save the new poi item to the database */
    createdId = db.storePOI(newPoi);
    if (createdId === null) {
        alert("Internal error, createNotePoi()");
        return;
    }
    newPoi.id = createdId;
	
	createNotePoiInDOM(newPoi); 
     
    hideClickIndicator();
    $('#notePoiList').modal('hide');
}


/* Maybe not needed. May be deleted later when confirmed that this would not be used. *
function addSubstance(str) {

    document.getElementById("obsPoiSubstance").value = str;
    
    /* Close the modal dialog *
    $('#substanceList').modal('hide');    
}*/


/* Maybe not needed. May be deleted later when confirmed that this would not be used. *
function addAnalysis(str) {

    var analysisField = document.getElementById("obsPoiAnalysis");
    
    /* Remove white space from both ends of the string *
    analysisField.value.trim();
    
    if (analysisField.value == "") {
        /* First item in the field *
        analysisField.value = str;
    }
    else {
        analysisField.value += ", " + str;
    }

    /* Close the modal dialog *
    $('#analysisList').modal('hide');
}*/


function obsPoiAddAnalysis() {

    var part1;
    var part2;
    var result = "";
    var analysisField = document.getElementById("obsPoiAnalysis");
    
    /* Find the selected hazard substance */
    part1 = document.getElementsByClassName('hazardClass active');
    
    /* Check if a something was selected */
    if (part1.length > 0) {
        result = part1[0].innerHTML;
    }
    
    /* Find the selected sample type */
    part2 = document.getElementsByClassName('sampleType active');
    
    /* Check if a something was selected */
    if (part2.length > 0) {
        if (result == "") { 
            result = part2[0].innerHTML;
        }
        else {
            result = result + " / " + part2[0].innerHTML;
        }
    }
    
    /* Set the selections to the Observation POI form */
    analysisField.value = result;
    
    /* Clear the selections from the dialog */
    $(".hazardClass").removeClass("active");
    $(".sampleType").removeClass("active");
}


/* Selects the clicked hazard substance options on display */
function obsPoiHazard(str) {

    var selElem;
    
    /* Remove the previous selection */
    $(".hazardClass").removeClass("active");

    selElem = document.getElementById("obsPoiHazard" + str);
    $(selElem).addClass("active");
}


/* Selects the clicked sample type on display */
function obsPoiSampleType(str) {

    var selElem;
    
    /* Remove the previous selection */
    $(".sampleType").removeClass("active");

    selElem = document.getElementById("obsPoiSampleType" + str);
    $(selElem).addClass("active");
}


function showClickIndicator() {

    var clickIndicatorElem;
    var iconLeft;
    var iconTop;

    clickIndicatorElem = document.getElementById("idClickPoint");
    
    /* Position the center of the icon to the clicked point */
    iconLeft = uiState.getClickedX() - CLICK_INDICATOR_OFFSET_X;
    iconTop = uiState.getClickedY() - CLICK_INDICATOR_OFFSET_Y;
    
    $(clickIndicatorElem).offset({top: iconTop, left: iconLeft});
    clickIndicatorElem.src = CLICK_INDICATOR_ICON;
    clickIndicatorElem.style.visibility = "visible";
}


function hideClickIndicator() {

    document.getElementById("idClickPoint").style.visibility = "hidden";
}
