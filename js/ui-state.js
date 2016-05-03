//
// ui-state.js
//
// One location to maintain UI state
//
// Jarmo Mäkelä, 2015-11-01
// demo v3
//


function uiStateStorageObject() {

	var storedCurrentDoc = ""; 
	var storedCameraUIOn = false;
	var storedZoomLevel = 1.0; 
	var storedRecentClickedX = 0;   // X-coord. of the point the user clicked in the plan
	var storedRecentClickedY = 0;   // y-coord. of the point the user clicked in the plan
	var poisAccepted = true;        // Can the current document accept POIs
	var storedModalOn = false;
	var noteViewXY = {left: 0, top: 0}; // Note view coords in dialog basic size
	
	this.setCurrentDoc = function(docFileName) {
		storedCurrentDoc = docFileName; 
	}; 

	this.getCurrentDoc = function() {
		return storedCurrentDoc; 
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
       displayed document may contain POIs. */
    this.setPoisAccepted = function(param) {
        poisAccepted = param;
    };
    
    /* Returns true if POIs are allowed in the currently dispayed document. */
    this.arePoisAccepted = function() {
        return poisAccepted;    
    };
    
    
    /* Functions for storing the left and top coordinates of a basic size note view */
    
    /* In-parameter properties: .left ((Int) and .top (Int) */
    this.setNoteViewCoord = function(leftAndTop) {
        noteViewXY = leftAndTop;
    };
    
    this.getNoteViewCoord = function() {
        return noteViewXY;
    };
    
}

var uiState = new uiStateStorageObject;
