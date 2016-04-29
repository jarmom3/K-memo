//
// uiState.js
//
// One location to maintain UI state
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


function uiStateStorageObject() {

	var storedCurrentFloor = "default-floor"; 
	var storedCameraUIOn = false;
	var storedZoomLevel = 1.0; 
	var storedRecentClickedX = 0;   // X-coord. of the point the user clicked in the plan
	var storedRecentClickedY = 0;   // y-coord. of the point the user clicked in the plan
	var poisAccepted = true;   // Can the current document accept POIs
	var storedModalOn = false;
	var noteViewXY = {left: 0, top: 0}; // Note view coords in dialog basic size


	this.setCurrentFloor = function(floorPlanId) {
		storedCurrentFloor = floorPlanId; 
	}; 

	this.getCurrentFloor = function() {
		return storedCurrentFloor; 
	}; 
	
	
	this.setCameraUIIsOn = function() {
		storedCameraUIOn = true; 
	}; 

	this.setCameraUIIsOff = function() {
		storedCameraUIOn = false; 
	}; 
	
	this.isCameraUIOn = function() {
		return storedCameraUIOn; 
	}; 


	this.setZoomLevel = function(zoomLevel) {
		storedZoomLevel = zoomLevel; 
	}; 
	
	this.getZoomLevel = function() {
		return storedZoomLevel; 
	}; 


    this.setClickedX = function(x) {
        storedRecentClickedX = x;
    };
    
    this.getClickedX = function() {
        return storedRecentClickedX;
    };
    
     this.setClickedY = function(y) {
        storedRecentClickedY = y;
    };
    
    this.getClickedY = function() {
        return storedRecentClickedY;
    };
    
    
    /* Input parameter true or false, depending whether the currently
       displayed document may contain POIs */
    this.setPoisAccepted = function(param) {
        poisAccepted = param;
    };
    
    /* Returns true if POIs are allowed in the currently dispayed document */
    this.arePoisAccepted = function() {
        return poisAccepted;    
    };
    

    /* The following functions are used in the implementation of modal dialogs */
    this.setModalOn = function() {
        storedModalOn = true;
    };
    
    this.setModalOff = function() {
        storedModalOn = false;
    };
    
    this.isModalOn = function() {
        return storedModalOn;
    };
    
    
    /* Functions for storing the left and top coordinates of a basic size note view */
    
    /* In-parameter properties: .left ((Int) and .top (Int) */
    this.setNoteViewCoord = function(leftAndTop) {
        noteViewXY = leftAndTop;
    };
    
    this.getNoteViewCoord = function() {
        return noteViewXY;
    };
    
}   // End of uiStateStorageObject class

var uiState = new uiStateStorageObject; 
