//
// image.js
//
// Floor plan image handling
//
// Jarmo Mäkelä, 2015-11-20
// demo v3
//


const ZOOMSTEPIN = 1.2; 
const ZOOMSTEPOUT = 1/ZOOMSTEPIN; 

function coordinateConversion() {

    //function dispToFloor
	// k defines how many display pixels is "one floor plan coordinate 
	// unit" at zoom level one. If "one floor plan coorinate unit" is
	// one pixel, then
	// k = floorPlanImageWidthAtScreen / floorPlanBitmapWidth
	this.k = 1; 
	
    //function dispToFloor
	// Input:
	//		origo: mandatory real; // floorPlan coordinate of display [0,0] 
	//		zoomLevel: mandatory real; 
	//	    displayCoordinate: mandatory real; // display coordinate to be converted
    // Returns 
	//		real: floor coordinate which equals the given display coordinate
	//
	this.dispToFloor = function(origo, zoomLevel, displayCoordinate) {
		return (displayCoordinate - origo) / (zoomLevel * this.k); 
	}; 
	
    //function floorToDisp
	// Input:
	//		origo: mandatory real; // floorPlan coordinate of display [0,0] 
	//		zoomLevel: mandatory real; 
	//	    floorCoordinate: mandatory real; // floor coordinate to be converted
	// Returns 
	//		real: display coordinate which equals the given floor coordinate
	//
	this.floorToDisp = function(origo, zoomLevel, floorCoordinate) {
		return floorCoordinate * zoomLevel * this.k + origo; 
	}; 
}

var coordConv = new coordinateConversion; 


function initImage(newDocFile) {
	
	hideContextMenu();
	
    var doc = docDb.findDocumentInfo(newDocFile); 


	/* Return if the document is already on the screen */
	if (uiState.getCurrentDoc() === newDocFile) {
	    return;
	}

	/* The document is changed so all visible POIs must be hidden */
	$(".poiClass").hide(); 
	
	uiState.setPoisAccepted(doc.POIsAccepted);	
    uiState.setCurrentDoc(newDocFile);
	
	/* Change the image on the screen */
	/* POIs are updated to the screen in function onloadNewImage. This
	   callback is set in mainInit(); */
	$("#floorPlanImg").hide().attr("src", newDocFile);
	// The rest of floor plan update code is in callback onloadNewImage
	
}

// POIs are uploaded from POI db and stored in DOM
function getPOIsFromDBtoDOM() {
	
	var storePOItoDOM = function (poi) {
		if ( poi.POIType == "Obs") {
			createObsPoiInDOM(poi);
		}
		else if (poi.POIType == "Note") {
			createNotePoiInDOM(poi); 
		};
	}
	
	db.iterateAllPOIs(storePOItoDOM); 
} 


// callback function to be called after new floor plan or document is loaded
function onloadNewImage() {

	var fpImg = $("#floorPlanImg"); 
	
	// coordConv.k defines how many screen pixels equals image bitmap pixel
	if ( fpImg[0].naturalWidth / fpImg[0].naturalHeight > // image aspect ratio; the [0] is jQuery peculiarities; see stackoverflow
		 screen.width / screen.height) // screen aspect ratio
		 {
			 // Height drives the scaling
			 coordConv.k = 0.9 * screen.width / fpImg[0].naturalWidth;
		 }
		 else {
		     coordConv.k = 0.75 * screen.height / fpImg[0].naturalHeight;
		 }
	
	// The initial size of floor plan image is zoomLevel 1.0
	fpImg[0].width =  coordConv.floorToDisp(0, 1.0, fpImg[0].naturalWidth); 
	uiState.setZoomLevel(1.0); 
	
	fpImg.show();
		
	if  ( uiState.arePoisAccepted() ) { 
		updatePOIsLocationsOnScreen(); 
		$("[data-floorID='" + uiState.getCurrentDoc() + "']").show();  	// Show POIs of this floor
	}
	
} 


function initFloorPlan(floorPlanId) {
	
	// Check if the user has selected the curretly visible floor
	if (floorPlanId === uiState.getCurrentDoc()) {
	    return;
	} 
	
	// Empty floor plan id indicates "onresize" event.
	// At the moment, resize does not require any actions
	if (floorPlanId === "") {
	    return;
	}
	
	// Floor plan image element
    var floorPlanImg = document.getElementById("floorPlanImg");
	 
	floorPlanImg.src = floorPlanId;
}


/* Zoom the picture one step in */
function updatePOIsLocationsOnScreen() {
	
	// get POIs in current floor
    var POIList = document.querySelectorAll( '[data-floorId="' + uiState.getCurrentDoc() + '"');    
    
	var location = {}; 
	var poiTop, poiLeft = 0;
	var type = ""; 
	for (i = 0; i < POIList.length;  i++) {
		
		// Get the real coordinates of the POI
		location = JSON.parse( POIList[i].getAttribute("data-locationXY")); 
		type = POIList[i].getAttribute("data-POIType"); 
		
		// Convert real coordinates to display coordinates
		poiLeft = coordConv.floorToDisp(0, uiState.getZoomLevel(), location.X); 
		poiTop = coordConv.floorToDisp(0, uiState.getZoomLevel(), location.Y); 

		if ( type == "Note") {
			POIList[i].style.top = (poiTop + 28) + "px"; 
			POIList[i].style.left = (poiLeft + 3) + "px"; 			
		}
		else {
			POIList[i].style.top = (poiTop - 6) + "px"; 
			POIList[i].style.left = (poiLeft - 1) + "px"; 
		}
	} 
}


/* Zoom the picture one step in */
function onZoomIn() {

    hideContextMenu();

	var fPImg = document.getElementById("floorPlanImg"); 
	
	// Set new zoom level
	uiState.setZoomLevel(uiState.getZoomLevel() * ZOOMSTEPIN);
	
	// calculate and update image width with the new zoom level
	fPImg.style.width  =  coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	// caculate and update POIs locations on screen
	updatePOIsLocationsOnScreen(); 
	
}


/* Zoom the picture one step out. */
function onZoomOut() {

	var fPImg = document.getElementById("floorPlanImg");
	
	hideContextMenu();
	
	// Set new zoom level
	uiState.setZoomLevel(uiState.getZoomLevel() * ZOOMSTEPOUT);
	
	// Calculate and update image width with the new zoom level
	fPImg.style.width = coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	// Calculate and update POI locations on screen
	updatePOIsLocationsOnScreen(); 
}


/* Show the full picture as large as possible i.e. use all the available space.  */
function onZoomReset() {

	var fPImg = document.getElementById("floorPlanImg"); 
	
	hideContextMenu();
	
	/* Left and top margins may be been changed as a result of moving the image */
	fPImg.style.marginLeft = "";
	fPImg.style.marginTop = "";
	
	// Set new zoom level
	uiState.setZoomLevel(1.0);
	
	// Calculate and update image width with the new zoom level
	fPImg.style.width = coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	// Calculate and update POI locations on screen
	updatePOIsLocationsOnScreen(); 
}


/* Zoom the picture one step in */
function pinchZoomIn(zoomFactor) {

    hideContextMenu();

	var fPImg = document.getElementById("floorPlanImg"); 
	
	// Set new zoom level
	uiState.setZoomLevel(uiState.getZoomLevel() * zoomFactor);
	
	// Calculate and update image width with the new zoom level
	fPImg.style.width = coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	// Calculate and update POI locations on screen
	updatePOIsLocationsOnScreen(); 
	
}


/* Zoom the picture one step out */
function pinchZoomOut(zoomFactor) {

	var fPImg = document.getElementById("floorPlanImg");
	
	hideContextMenu();
	
	// Set new zoom level
	uiState.setZoomLevel(uiState.getZoomLevel() * zoomFactor);
	
	// Calculate and update image width with the new zoom level
	fPImg.style.width = coordConv.floorToDisp(0, fPImg.naturalWidth, uiState.getZoomLevel()) + "px"; 

	// Calculate and update POI locations on screen
	updatePOIsLocationsOnScreen(); 
}
