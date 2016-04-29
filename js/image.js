//
// image.js
//
// Floor plan image handling
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


const ZOOMSTEPIN = 1.2; 
const ZOOMSTEPOUT = 1/ZOOMSTEPIN; 

function coordinateConversion() {

/** function dispToFloor *******************************************/
	// k defines how many display pixels is "one floor plan coordinate 
	// unit" at zoom level one. If "one floor plan coordinate unit" is
	// one pixel, then
	// k = floorPlanImageWidthAtScreen / floorPlanBitmapWidth
	this.k = 1; 
	
/** function dispToFloor *******************************************/
	// Input:
	//		origo: mandatory real; // floorPlan coordinate of display [0,0] 
	//		zoomLevel: mandatory real; 
	//	    displayCoordinate: mandatory real; // Display coordinate to be converted
    // Returns 
	//		real: Floor coordinate which equals the given display coordinate
	//
	this.dispToFloor = function(origo, zoomLevel, displayCoordinate) {
		return (displayCoordinate - origo) / (zoomLevel * this.k); 
	}; 
	
/** function floorToDisp *******************************************/
	// Input:
	//		origo: mandatory real; // floorPlan coordinate of display [0,0] 
	//		zoomLevel: mandatory real; 
	//	    floorCoordinate: mandatory real; // floor coordinate to be converted
	// Returns 
	//		real: Display coordinate which equals the given floor coordinate
	//
	this.floorToDisp = function(origo, zoomLevel, floorCoordinate) {
		return floorCoordinate * zoomLevel * this.k + origo; 
	}; 

};	

var coordConv = new coordinateConversion; 


function initImage(paperId) {
    var doc;
	
	/* Floor plan image element */
	var floorPlanImg = document.getElementById("mainViewImage");
	
    /* Check whether POIs are accepted in this document type */
    var documentInfo = docInfo.findDocumentInfo(paperId);
    if (documentInfo != null) {
        if (documentInfo.POIsAccepted == true) {

			/* Set asynchronous callback for zoomLevel etc. calculation.
			   Note that these calculations can be done after the full 
			   floor plan image is fully loaded */
			floorPlanImg.onload = function() { onLoadFloorPlan(paperId, floorPlanImg); }; 
			
			/* Init floor plan image */
            uiState.setPoisAccepted(true);
			initFloorPlan(paperId); 
					
        } else {
			
			/* The onload callback is relevant for floor plans only */
			floorPlanImg.onload = "";
			uiState.setCurrentFloor(""); 
			
			/* Init other document image */
            uiState.setPoisAccepted(false);
			initDocument(paperId); 
        }; 
    };
    
    /* Show the name of the current document in the main view header */
    doc = docInfo.findDocumentInfo(paperId);
	document.getElementById("idDocument").innerHTML = doc.documentName; 
}; 


function initDocument(paperId) {
	
	var allPOIList = document.getElementsByClassName("POIClass"); 
	
	for (i = 0; i < allPOIList.length;  i++) { 
		allPOIList[i].style.display = "none" }; 	
	
	var mainViewImg = document.getElementById("mainViewImage");
	mainViewImg.src = paperId;
}; 


/* Callback function to be called after new floor plan is updated to the screen */

function onLoadFloorPlan (fPId, fPImg) {

	uiState.setCurrentFloor(fPId); 

	/* Find such a zoom level for floor image that in full screen mode 
	   it doesn't need to be scrolled */
	
	/* If the image aspect ratio is bigger than the screen aspect ratio, then
	   the width of the image defines the zoom level. Otherwise the height
	   defines the aspect ratio. */
	
	/* coordConv.k defines how many screen pixels equals image bitmap pixel */
	if ( fPImg.naturalWidth / fPImg.naturalHeight >   // Image aspect ratio
		 screen.width / screen.height)   // Screen aspect ratio
		 {
			 /* Height defines the scaling */
			 coordConv.k = 0.9 * screen.width / fPImg.naturalWidth;
		 } else {
			coordConv.k = 0.75 * screen.height / fPImg.naturalHeight;
		 }
	
	/* The initial size of the floor plan image is zoomLevel 1.0 */
	uiState.setZoomLevel(1.0); 
	
	fPImg.style.width =  coordConv.floorToDisp(0, 1.0, fPImg.naturalWidth) + "px"; 
	
	/* Hide all POIs which are not on the floor,
	   and show all POIs which are on the floor */
	var allPOIList = document.getElementsByClassName("POIClass"); 
	for (i = 0; i < allPOIList.length;  i++) {
		if ( allPOIList[i].getAttribute("data-floorID") === fPId)
			{ allPOIList[i].style.display = "block" }
		else
			{ allPOIList[i].style.display = "none" }	
	}; 

	updatePOIsLocationsOnScreen(); 	
} 


function initFloorPlan(floorPlanId) {
	
	/* Check if the user has selected the currently visible floor */
	if (floorPlanId === uiState.getCurrentFloor()) {
	    return;
	} 
	
	/* Empty floorplan id indicates onresize -event. At the moment,
	  resize does not require any actions */
	//if (floorPlanId === "") {
	//    return;
	//} 

    //spinnerStart();   Spinner not needed in the demo
	
	/* Floorplan image element */
    var floorPlanImg = document.getElementById("mainViewImage");
	 
	/* It is assumed that the floorplan id exists. Loading the image may take time. */

    /* This triggers asyncronous call of onLoadFloorPlan(floorPlanId, floorPlanImg); */
	floorPlanImg.src = floorPlanId; 
	
    //spinnerStop();
}; 


function updatePOIsLocationsOnScreen() {
	
	/* Get POIs in the current floor */
    var POIList = document.querySelectorAll( '[data-floorId="' + uiState.getCurrentFloor() + '"');    
    
	var location = {}; 
	var poiTop, poiLeft = 0;
	var type = ""; 
	for (i = 0; i < POIList.length;  i++) {
		
		/* Get the real coordinates of the POI */
		location = JSON.parse( POIList[i].getAttribute("data-locationXY")); 
		type = POIList[i].getAttribute("data-POIType"); 
		
		/* Convert real coordinates to display coordinates */
		poiLeft = coordConv.floorToDisp(
			50, 
			uiState.getZoomLevel(),
			location.X
		); 
		poiTop = coordConv.floorToDisp(
			0, 
			uiState.getZoomLevel(), 
			location.Y
		); 
	
		if ( type == "Std") {
			POIList[i].style.top = (poiTop - POI_STD_OFFSET_Y) + "px"; 
			POIList[i].style.left = (poiLeft - POI_STD_OFFSET_X) + "px"; 			
		} else {
			POIList[i].style.top = (poiTop - POI_ICON_OFFSET_Y) + "px"; 
			POIList[i].style.left = (poiLeft - POI_ICON_OFFSET_X) + "px"; 
		}; 
	}; 
}


/* Zoom the picture one step in */
function onZoomIn() {
	/* Do not accept clicks if a modal dialog is on display */
	if (uiState.isModalOn() == true) {
		return;
	}

	var fPImg = document.getElementById("mainViewImage"); 
	
	/* Set the new zoom level */
	uiState.setZoomLevel( uiState.getZoomLevel() * ZOOMSTEPIN);
	
	/* Calculate and update image width with the new zoom level */
	fPImg.style.width  =  coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	/* Calculate and update POI locations on screen */
	updatePOIsLocationsOnScreen(); 
}


/* Zoom the picture one step out */
function onZoomOut() {
	/* Do not accept clicks if a modal dialog is on display */
	if (uiState.isModalOn() == true) {
		return;
	}

	var fPImg = document.getElementById("mainViewImage"); 
	
	/* Set the new zoom level */
	uiState.setZoomLevel( uiState.getZoomLevel() * ZOOMSTEPOUT);
	
	/* Calculate and update image width with the new zoom level */
	fPImg.style.width  =  coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	/* Calculate and update POI locations on screen */
	updatePOIsLocationsOnScreen(); 
}


/* Show the full picture as large as possible i.e. use all the available space.  */
function onZoomReset() {
	/* Do not accept clicks if a modal dialog is on display */
	if (uiState.isModalOn() == true) {
		return;
	}

	var fPImg = document.getElementById("mainViewImage"); 
	
	/* Set the new zoom level */
	uiState.setZoomLevel( 1.0 );
	
	/* Calculate and update image width with the new zoom level */
	fPImg.style.width  =  coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	/* Calculate and update POI locations on screen */
	updatePOIsLocationsOnScreen(); 
}
