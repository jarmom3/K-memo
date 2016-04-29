//
// poi.js
//
// POI creation functions
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


/* These two constants depend on the poi-icon size and shape. To be redefined
   if the poi-icon is changed. The center of the poi-icon bottom should point
   exactly to where the user has clicked. */
var POI_ICON_OFFSET_X = 16;
var POI_ICON_OFFSET_Y = 48;

/* Standard POI offsets */
var POI_STD_OFFSET_X = 12; 
var POI_STD_OFFSET_Y = 14; 

/* Sample POI offsets */
var POI_SAMPLE_OFFSET_X = 12; 
var POI_SAMPLE_OFFSET_Y = 14;

/* The click indicator offset values depend in the icon size */
var CLICK_INDICATOR_OFFSET_X = 13;
var CLICK_INDICATOR_OFFSET_Y = 13;
var CLICK_INDICATOR_ID = "idClickPoint";

var CLICK_ICON_SPACE = 15;      // Icon center distance from the menu + some extra space
var POI_VIEW_SPACE = 3          // POI view dialog corner distance from the POI icon
var POI_VIEW_WIDTH = "390px";   // Initial width of the poi view
var POI_VIEW_HEIGHT = "230px";  // Initial height of the poi view
var POI_VIEW_IMG_WIDTH_S = "230px";   // Image width when small in poi view
var POI_VIEW_IMG_HEIGHT_S = "175px";  // Image height when small in poi view

var nextSamplePoiNbr = 1;    // Default value for the sample poi number


function createNotePoi() {
    var clickX;       // X-coordinate of the clicked point
    var clickY;       // Y-coordinate of the clicked point
    var windowWidth;  // Window (visible area) width
    var windowHeight; // Window (visible area) height
    var formWidth;    // Note POI input dialog width
    var formHeight;   // Note POI input dialog height
    var formTop;      // X-coordinate of the Note POI input dialog top left corner
    var formLeft;     // Y-coordinate of the Note POI input dialog top left corner
  
    uiState.setModalOn();
    showClickIndicator();
    
    clickX = uiState.getClickedX();
    clickY = uiState.getClickedY();
    
    /*  Check the size of the window (visible area) and the input form */
    windowWidth = document.body.clientWidth;
    windowHeight = document.body.clientHeight;
    formWidth = $("#notePoiForm").outerWidth();  // Include the border and padding
    formHeight = $("#notePoiForm").outerHeight();
    
    /* Calculate where the Note POI input form can be put.
       Take into account the space the click indicator needs. */
    if ((clickX + formWidth + CLICK_ICON_SPACE) > (windowWidth)) {
        /* Put the menu left to the clicked point */
        formLeft = clickX - formWidth - CLICK_ICON_SPACE;
    } else {
        formLeft = clickX + CLICK_ICON_SPACE;            
    }
                
    if ((clickY + formHeight + CLICK_ICON_SPACE) > (windowHeight)) {
        /* Put the form to the clicked point */
        formTop = clickY - formHeight - CLICK_ICON_SPACE;
    } else {
        formTop = clickY + CLICK_ICON_SPACE;
    }
    
    $("#notePoiForm").css({top: formTop, left: formLeft, position:'absolute'});
    document.getElementById("noteFormText").value = "";
    
    /* Show the input dialog */
    $("#notePoiForm").show();
    document.getElementById("noteFormText").focus();
}
    

function createPicPoi() {

    /* THE ACTUAL PIC POI CREATION DOESN'T WORK YET. INSTEAD, CREATE A DUMMY POI */
    savePoi("Valokuva", "Pic");
    return;

    /* This is an onclick function for the image selector, and is called when the
       selector is displayed, and when a selection is made. */

    var fileElem = document.getElementById("imgSelector");
    if (fileElem.value == "") {
        /* File selector launched but no file selected yet so return */
        return;
    }

    savePoi(fileElem.value, "Pic", fileElem.value);
    
    /* Clear the filename */
    fileElem.value = "";
}    
    

function createSamplePoi() {
    var clickX;       // X-coordinate of the clicked point
    var clickY;       // Y-coordinate of the clicked point
    var windowWidth;  // Window (visible area) width
    var windowHeight; // Window (visible area) height
    var formWidth;    // Sample POI input dialog width
    var formHeight;   // Sample POI input dialog height
    var formTop;      // X-coordinate of the Sample POI input dialog top left corner
    var formLeft;     // Y-coordinate of the Sample POI input dialog top left corner

    uiState.setModalOn();
    showClickIndicator();
    
    clickX = uiState.getClickedX();
    clickY = uiState.getClickedY();
    
    /*  Check the size of the window (visible area) and the input form */
    windowWidth = document.body.clientWidth;
    windowHeight = document.body.clientHeight;
    formWidth = $("#samplePoiForm").outerWidth();  // Include the border and padding
    formHeight = $("#samplePoiForm").outerHeight();
    
    /* Calculate where the Note POI input form can be put.
       Take into account the space the click indicator needs. */
    if ((clickX + formWidth + CLICK_ICON_SPACE) > (windowWidth)) {
        /* Put the menu left to the clicked point */
        formLeft = clickX - formWidth - CLICK_ICON_SPACE;
    } else {
        formLeft = clickX + CLICK_ICON_SPACE;            
    }
                
    if ((clickY + formHeight + CLICK_ICON_SPACE) > (windowHeight)) {
        /* Put the form to the clicked point */
        formTop = clickY - formHeight - CLICK_ICON_SPACE;
    } else {
        formTop = clickY + CLICK_ICON_SPACE;
    }
    
    $("#samplePoiForm").css({top: formTop, left: formLeft, position:'absolute'});
    document.getElementById("samplePoiNumber").value = nextSamplePoiNbr;
    document.getElementById("samplePoiAnalysis").value = "";
    document.getElementById("samplePoiInfo").value = "";
    
    /* Show the input dialog */
    $("#samplePoiForm").show();
    document.getElementById("samplePoiInfo").focus();
}


function showStandardPoiList() {

    uiState.setModalOn();

	stdPOIList = document.getElementById("stdPOISelection");
	stdPOIList.style.left = uiState.getClickedX() + "px"; 
	stdPOIList.style.top = uiState.getClickedY() + "px";  

	stdPOIList.style.display = "block";

}

function stdPOISelectionHandler (value) {
	
	// Hide std POI selectionbox
	document.getElementById("stdPOISelection").style.display = "none";

	savePoi(value, "Std", value); 
	uiState.setModalOff();
	
}; 

function savePoi(poiText, poiType, poiData) {  // poiData is optional parameter
    
    var floorPlan;   // Floorplan HTML-element
    var poiElem;   // New poi HTML-element
    var poiLeft, poiTop;   // Coordinates where to put the new poi
    var onClickStr;   // onClick function for the new poi
    var path;
    var fileName;
 
    var newPoi = {
	    id: null,
	    POIType: poiType,
	    floorPlanId: "",
	    locationX: 0,
	    locationY: 0,
	    data: poiText,
	    attachmentUrl: ""
    };

	var thisOffset = $(document.getElementById("mainViewImage")).offset(); 
	
	hideClickIndicator();
		
	newPoi.locationX = coordConv.dispToFloor(
		thisOffset.left,
		uiState.getZoomLevel(), 
		uiState.getClickedX()); 
	newPoi.locationY = coordConv.dispToFloor(
		thisOffset.top,
		uiState.getZoomLevel(),  
		uiState.getClickedY()); 
	newPoi.floorPlanId = uiState.getCurrentFloor(); 

     /* Calculate the coordinates for the new poi. */
	if (poiType == "Note" || poiType == "Pic") {
        poiLeft = uiState.getClickedX() - POI_ICON_OFFSET_X;
        poiTop = uiState.getClickedY() - POI_ICON_OFFSET_Y;
    } else if (poiType == "Std") {
        poiLeft = uiState.getClickedX() - POI_STD_OFFSET_X;
        poiTop = uiState.getClickedY() - POI_STD_OFFSET_Y;
    } else if (poiType == "Sample") {
        poiLeft = uiState.getClickedX() - POI_SAMPLE_OFFSET_X;
        poiTop = uiState.getClickedY() - POI_SAMPLE_OFFSET_Y;		
	} else {
        alert("poi.js, savePoi(), toteutus puuttuu tällä poi-tyypille");
    }
  

    if (poiType == "Note" || poiType == "Pic") {
        /* Temporary solution to enable picture showing in the demo version */
        path = "img/";
        if (poiType == "Note") {
            fileName = document.getElementById("noteFormAttachment").value;
            var f = fileName.substring(fileName.lastIndexOf('/')+1);
            fileName = f;
        }
        else if (poiType == "Pic") {
            /* Camera integration missing so always show the same image */
            fileName = "asbesti.jpg";
        }    
        newPoi.attachmentUrl = path + fileName;
    }
    
    /* Save the new poi data to the database */
    var createdId = db.storePOI(newPoi);
    if (createdId == null) {
        alert("Internal error, savePoi()");
        return;
    }
    
    /* Create a new poi element to the display. Place it initially to coordinates 0,0
       as hidden, then later set the real coordinates and make the element visible. */

    if (poiType == "Note" || poiType == "Pic") {
        poiElem = document.createElement("img");
    }
    else if (poiType == "Std" || poiType == "Sample") {
        poiElem = document.createElement("div");
    }
    
    poiElem.style.visibility = "hidden";
    poiElem.style.position = 'absolute';
    poiElem.style.left = 0;
    poiElem.style.top = 0;
    
    
    /* Note and Pic type POIs are shown as icons */
    if (poiType == "Note") {
        poiElem.src = "img/poi-note.png";
    }
    else if (poiType == "Pic") {
        poiElem.src = "img/poi-pic.png";
    }
    else if (poiType == "Std") {
		poiElem.innerHTML = poiData; 
		poiElem.style.border = "1px solid black";
		poiElem.style.backgroundColor = "#EEDC31";
		poiElem.style.paddingTop = "2px";
		poiElem.style.paddingLeft = "4px";
		poiElem.style.paddingRight = "4px";
	}
	else if (poiType == "Sample") {
		poiElem.innerHTML = "N" + poiData; 
		poiElem.style.border = "1px solid black";
		poiElem.style.backgroundColor = "#7FDB6A";
		poiElem.style.paddingTop = "2px";
		poiElem.style.paddingLeft = "4px";
		poiElem.style.paddingRight = "4px";
	}; 
    /* IMPLEMENTATION FOR OTHER POI TYPES MISSING */
    
    poiElem.id = "poi" + createdId.toString();   // May be useful later, not needed now
    poiElem.className = "POIClass";
    
	poiElem.setAttribute("data-POIType", poiType); 
    poiElem.setAttribute("data-floorId", uiState.getCurrentFloor());
    poiElem.setAttribute("data-locationXY", '{"X":"' + newPoi.locationX + '","Y":"' + newPoi.locationY + '"}');
    
    onClickStr = "showPoi(" + createdId.toString() + ");";
    poiElem.setAttribute("onclick", onClickStr);

    floorPlan = document.getElementById("mainViewPaper");
    floorPlan.appendChild(poiElem);
    $(poiElem).offset({top: poiTop, left: poiLeft});
    poiElem.style.display = "block";
    poiElem.style.visibility = "visible";   
}


function showPoi(id) {
    var poi = db.getPOIById(id);  
    var clickX;       // X-coordinate of the clicked point
    var clickY;       // Y-coordinate of the clicked point
    var windowWidth;  // Window (visible area) width
    var windowHeight; // Window (visible area) height
    var formWidth;    // Note POI input dialog width
    var formHeight;   // Note POI input dialog height
    var formTop;      // X-coordinate of the Note POI input dialog top left corner
    var formLeft;     // Y-coordinate of the Note POI input dialog top left corner
    var imgElem;      // Attached image
    var onClickStr;   // Function to be launched upon image click
    var imgAreaWidth;
    var imgAreaHeight;
    var imgPixelWidth;
    var imgPixelHeight;
    var widthRatio;
    var heightRatio;
    var txtContainer;
   
    uiState.setModalOn();
    
    /* Convert the stored POI coordinates to display coordinates */
	clickX = coordConv.floorToDisp(0, poi.locationX, uiState.getZoomLevel()); 
    clickY = coordConv.floorToDisp(0, poi.locationY, uiState.getZoomLevel());
    
    clickY += 53;   // TEMPORARY HACK, DO PROPER FIX LATER
    
    /*  Find out the size of the window (visible area) and the dialog */
    windowWidth = document.body.clientWidth;
    windowHeight = document.body.clientHeight;
    formWidth = parseInt(POI_VIEW_WIDTH) + 22; // 22 for the border and padding
    formHeight = parseInt(POI_VIEW_HEIGHT) + 22;
    
    /* Calculate where the Note POI input form can be put.
       Take into account the space the click indicator needs. */
    if ((clickX + formWidth + POI_VIEW_SPACE) > (windowWidth)) {
        /* Put the menu left to the clicked point */
        formLeft = clickX - formWidth - POI_VIEW_SPACE;
    } else {
        formLeft = clickX + POI_VIEW_SPACE;            
    }
                
    if ((clickY + formHeight + POI_VIEW_SPACE) > (windowHeight)) {
        /* Put the form to the clicked point */
        formTop = clickY - formHeight - POI_VIEW_SPACE;
    } else {
        formTop = clickY + POI_VIEW_SPACE;
    }
    
    onClickStr = "toggleNotePoiView();";
    $("#notePoiView").attr("onclick", onClickStr);
    $("#notePoiView").css({top: formTop, left: formLeft,
        position:'absolute', width: POI_VIEW_WIDTH, height: POI_VIEW_HEIGHT});
    $("#poiViewImgContainer").css({width: parseInt(POI_VIEW_IMG_WIDTH_S), 
                                   height: parseInt(POI_VIEW_IMG_HEIGHT_S)});
        
    imgElem = document.getElementById("notePoiAttachment");
    
    imgElem.src = poi.attachmentUrl;
    imgElem.style.cssFloat = "left";
    
    txtContainer = document.getElementById("notePoiText");
    if (poi.data == "") {
        txtContainer.innerHTML = "(Ei kuvausta)"
    } else {
        txtContainer.innerHTML = poi.data;
    }
    
    /* Find the size of the area available for the image */
    imgAreaWidth = parseInt(POI_VIEW_WIDTH)
        - document.getElementById("noteViewClose").offsetWidth - 10;
    imgAreaHeight = parseInt(POI_VIEW_HEIGHT) - txtContainer.offsetHeight;
    
    /* Find the image dimensions in pixels */
    imgPixelWidth = imgElem.naturalWidth;
    imgPixelHeight = imgElem.naturalHeight;

    widthRatio = imgAreaWidth / imgPixelWidth;
    heightRatio = imgAreaHeight / imgPixelHeight;
  
    /* Check whether the width or the height defines the zoom factor */
    if (widthRatio < heightRatio) {
        imgElem.style.width = "100%";
        
        /* Calculate the width zoom factor and use it also for the height */
        imgElem.style.height = Math.round(widthRatio * imgPixelHeight) + "px";
    } else {
        imgElem.style.height = "100%";
            
        /* Calculate the height zoom factor and use it also for the width */
        imgElem.style.width = Math.round(heightRatio * imgPixelWidth) + "px";
    } 
     
    /* Save the view dialog left and top attributes */
    var leftAndTop = {left: formLeft, top: formTop};
    uiState.setNoteViewCoord(leftAndTop);
    
    /* Show the view dialog */
    $("#notePoiView").show();
}


/* Switch between the basic and full-size Note poi view */
function toggleNotePoiView() {
    var paperElem = document.getElementById("mainViewPaper");
    
    /* Left-top corner coordinates of the full-size image */
    var newLeft = paperElem.offsetLeft;
    var newTop = paperElem.offsetTop;

    /* Visible area (i.e not including the scrolled off area) width and height */
    var viewportHeight = $(window).height();
    var viewportWidth = $(window).width();
    
    var currentWidth;
    var newWidth;
    var newHeight;
    var imgAreaWidth;
    var imgAreaHeight;
    var imgPixelWidth;
    var imgPixelHeight;
    var widthRatio;
    var heightRatio;
    
    var imgElem = document.getElementById("notePoiAttachment");
    var imgContainer = document.getElementById("poiViewImgContainer");
    var txtContainer = document.getElementById("notePoiText");
    
    /* Use an estimate for the scrollbar width and height.
       ADD PROPER CALCULATIONS LATER. */
    newWidth = viewportWidth - 30;
    newHeight = viewportHeight - 30 - paperElem.offsetTop; // Minus also the header area

    var currentWidth = parseInt(document.getElementById("notePoiView").style.width);
  
    /* Find the image dimensions in pixels */
    imgPixelWidth = imgElem.naturalWidth;
    imgPixelHeight = imgElem.naturalHeight;
    
    if (currentWidth == newWidth) {
        /* Already in maximized view. Minimize the view. */
        
        var coord = uiState.getNoteViewCoord();  
        $("#notePoiView").css({top: coord.top, left: coord.left,
            position:'absolute', width: POI_VIEW_WIDTH, height: POI_VIEW_HEIGHT});
        $("#poiViewImgContainer").css({width: parseInt(POI_VIEW_IMG_WIDTH_S), 
                                       height: parseInt(POI_VIEW_IMG_HEIGHT_S)});
                                       
        /* Find the size of the area available for the image */
        imgAreaWidth = parseInt(POI_VIEW_WIDTH)
            - document.getElementById("noteViewClose").offsetWidth - 10;
        imgAreaHeight = parseInt(POI_VIEW_HEIGHT) - txtContainer.offsetHeight;
         
        widthRatio = imgAreaWidth / imgPixelWidth;
        heightRatio = imgAreaHeight / imgPixelHeight;
                                       
        /* Check whether the width or the height defines the zoom factor */
        if (widthRatio < heightRatio) {
            imgElem.style.width = "100%";
            
            /* Calculate the width zoom factor and use it also for the height */
            imgElem.style.height = Math.round(widthRatio * imgPixelHeight) + "px";
        } else {
            imgElem.style.height = "100%";
            
            /* Calculate the height zoom factor and use it also for the width */
            imgElem.style.width = Math.round(heightRatio * imgPixelWidth) + "px";
        } 
                                                   
    } else {
        /* Maximize the view */
        
        $("#notePoiView").css({top: newTop, left: newLeft,
            position:'absolute', width: newWidth, height: newHeight});
        
        /* Find the size of the area available for the image */
        imgAreaWidth = newWidth - document.getElementById("noteViewClose").offsetWidth - 10;
        imgAreaHeight = newHeight - txtContainer.offsetHeight;
        
        widthRatio = imgAreaWidth / imgPixelWidth;
        heightRatio = imgAreaHeight / imgPixelHeight;
        
        $("#poiViewImgContainer").css({width: imgAreaWidth, height: imgAreaHeight});
        
        /* Check whether the width or the height defines the zoom factor */
        if (widthRatio < heightRatio) {
            imgElem.style.width = "100%";
            
            /* Calculate the width zoom factor and use it also for the height */
            imgElem.style.height = Math.round(widthRatio * imgPixelHeight) + "px";
        } else {
            imgElem.style.height = "100%";
            
            /* Calculate the height zoom factor and use it also for the width */
            imgElem.style.width = Math.round(heightRatio * imgPixelWidth) + "px";
        }
    }
}


function notePoiViewClose() {
    var poiView;
    
    $("#notePoiView").hide();
    
    /* Reset the width and height attributes */
    poiView = document.getElementById("notePoiView");
    poiView.style.width = POI_VIEW_WIDTH;
    poiView.style.height = POI_VIEW_HEIGHT;

    uiState.setModalOff();
}


function notePoiFormOK() {

    /* Get the user input */
    var poiText = document.getElementById("noteFormText").value;
    
    $("#notePoiForm").hide();
    uiState.setModalOff();
    
    savePoi(poiText, "Note");
}


function notePoiFormCancel() {

    hideClickIndicator();
    $("#notePoiForm").hide();
    uiState.setModalOff();
}


function samplePoiAnalysisHandler() {
    uiState.setModalOn();
    $("#samplePoiAlalysisSelection").show();
}


function samplePoiFormOK() {

    /* Get the user input */
    var poiNumber = document.getElementById("samplePoiNumber").value;
    
    $("#samplePoiForm").hide();
    uiState.setModalOff();
    
    savePoi(poiNumber, "Sample", poiNumber);
    nextSamplePoiNbr++;
}


function samplePoiFormCancel() {

    hideClickIndicator();
    $("#samplePoiForm").hide();
    uiState.setModalOff();
}


function samplePoiAnalysisAdd(newValue) {
    var analysisField = document.getElementById("samplePoiAnalysis");
    
    if (analysisField.value == "") {
        /* No previous input in the field */
        analysisField.value = newValue;
    } else {
        /* Add the new selection to the end of the field */
        analysisField.value = analysisField.value + ", " + newValue;
    }
    
    $("#samplePoiAlalysisSelection").hide();
    uiState.setModalOff();
}


function showClickIndicator() {
    var iconLeft;
    var iconTop;

    /* Create a new image element for the click point indicator */
    var elem = document.createElement("img");
    var parentElem = document.getElementById("mainViewPaper");
    
    parentElem.appendChild(elem);
    
    elem.id = CLICK_INDICATOR_ID;
    elem.style.visibility = "hidden";
    elem.style.position = 'absolute';
    
    /* Position the center of the icon to the clicked point */
    iconLeft = uiState.getClickedX() - CLICK_INDICATOR_OFFSET_X;
    iconTop = uiState.getClickedY() - CLICK_INDICATOR_OFFSET_Y;
    $(elem).offset({top: iconTop, left: iconLeft});
    
    elem.src = "img/clickpoint.png";
    elem.style.visibility = "visible"; 
}


function hideClickIndicator() {

    /* Go to the parent first. Direct element removal is not allowed. */
    var elem = document.getElementById(CLICK_INDICATOR_ID);
    
    /* Check if the element exists */
    if (elem !== null) {
        elem.parentNode.removeChild(elem);
    
        /* Now delete the element */
        elem.remove();
    }
}
