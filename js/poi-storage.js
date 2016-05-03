//
// poi-storage.js
//
// Local storage for POIs
//
// Jarmo Mäkelä, 2015-10-26
// demo v3
//


// Valid POI types
const POITYPEVALUES = ["Obs", "Pic", "Note"]; 

function localPOIStorage() {

	// Input:
	//   id:           null
	//	 POIType:      String (mandatory), values in POITYPEVALUES
	//	 floorPlanId:  String (mandatory)
	//	 locationX:    Integer (mandatory) 
	//	 locationY:    Integer (mandatory) 
	//	 other fields: optional 
	// Returns :
	//   Integer POI.id or null in case of an error
	//
	this.storePOI = function(POI) {

		var firstUnusedId = -1; 

		// Null data is not stored
		if (POITYPEVALUES.indexOf(POI.POIType) === -1 || POI.locationX === null ||
			POI.locationY === null || POI.floorPlanId === null) {
			
		    return null;
		}

		firstUnusedId = localStorage.firstUnusedId; 
		
		POI.id = firstUnusedId; 
		localStorage.setItem(firstUnusedId, JSON.stringify(POI)); 
		localStorage.firstUnusedId = Number(localStorage.firstUnusedId) + 1; 
		
		return (firstUnusedId); 
    };


	// Input:
	//   id:           Integer (mandatory), must exist in POI database
	//   POIType:      String (mandatory), values in POITYPEVALUES, can't be changed
	//   floorPlanId:  String (mandatory), can't be changed
	//   locationX:    Integer (mandatory), can be changed
	//   locationY:    Integer (mandatory), can be changed 
	//   other fields: optional, can be changed 
	// Returns:
	//   Integer 1 if successful update or null if:
	//   - POI does not exist
	//   - POIType differs from the stored POIType
	//   - floorPlanId differs from the stored floorPlanId
	//
	this.updatePOI = function(POI) {
		
		// Check if mandatory fields exist
		if (POI.id === null || POITYPEVALUES.indexOf(POI.POIType) === -1 ||
		    POI.floorPlanId === null || POI.locationX === null ||
		    POI.locationY === null || POI.floorPlanId === null) {
			
		    return null;
		}

		// Check if POI exists
		if (localStorage.getItem(POI.id) == undefined) {
		  return null;
		} 
		
		localStorage.setItem(POI.id, JSON.stringify(POI)); 
		return 1; 
	};
	
	
	// Input:
	//   id: Integer (mandatory) 
	// Returns:
	//   Integer 1 if successful, 0 if the POI doesn't exist
	//
	this.deletePOI = function(id) {

		if (localStorage.getItem(id) == undefined) {
		    return 0;
		}
		
		localStorage.removeItem(id); 
		return 1;
    };	
	
	
	// Input:
	//	 id: Integer; 
	// Returns: 
	//	 Stored POI or null if the id doesn't exist
	//
 	this.getPOIById = function(id) {
		
		POIstr = localStorage.getItem(id); 
		POI = JSON.parse(POIstr); 
		a = 1; 
		return POI;
    };


	// Input: callback to be called for each POI
	// Returns:  -
	//
 	this.iterateAllPOIs = function(handlePOI) {
		
		for (var i = 0; i < localStorage.length; i++) {
		    var tmp = localStorage.getItem(localStorage.key(i));
			var item  = JSON.parse(localStorage.getItem(localStorage.key(i))); 
			if (item.POIType != undefined) { 
			    handlePOI(item);
			}
		}
    };

	
	// Input: -
	// Returns:  -
	//
 	this.deleteAllPOIs = function() {
		localStorage.clear(); 		
    };


	// Input: -
	// Returns: Number of stored POIS
	//
	this.getNbrOfPOIs = function() {
		return DataStorage.length;
    };
	
}

var db = new localPOIStorage;


// Run the following function instantly
(function () {

	if (localStorage.firstUnusedId == undefined) {
	    localStorage.firstUnusedId = 0;
	}
})();
