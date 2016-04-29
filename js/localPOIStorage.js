//
// localPOIStorage.js
//
// Local storage for POIs
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


/* Valid POI types */
const POITYPEVALUES = ["Std", "Note", "Pic", "Sample"]; 

function localPOIStorage() {

	var DataStorage = []; 
	var firstUnusedId = 0; 


/* function storePOI */
	// Input:
	//		id: mandatory null;
	//		POIType : mandatory string, values in POITYPEVALUES
	//		floorPlanId : mandatory string
	//		locationX : mandatory integer 
	//		locationY : mandatory integer 
	//		other fields : optional
	// Returns: 
	//		integer POI.id or null in case of error
	//
	this.storePOI = function(POI) {
		/* Null data is not stored */
		if (POITYPEVALUES.indexOf(POI.POIType) === -1 ||
			POI.locationX == null ||
			POI.locationY == null ||
			POI.floorPlanId == null) {
		    return null;
		} 
		
		var cloneOfPOI = JSON.parse(JSON.stringify(POI));
		cloneOfPOI.id = firstUnusedId; 
		var len = DataStorage.push(cloneOfPOI);
		firstUnusedId++; 
		return (firstUnusedId-1); 
    };
    

/* function updatePOI */
	// Input:
	//		id: mandatory integer, must exist in POI database
	//		POIType : mandatory string, values in POITYPEVALUES, can't
	//			      be changed
	//		floorPlanId : mandatory string; can't be changed
	//		locationX : mandatory integer; can be changed
	//		locationY : mandatory integer; can be changed
	//		other fields : optional; can be changed 
	// Returns:
	//		integer 1 if successful update, or null if:
	//			- POI does not exist
	//			- POIType differs from stored POIType
	//			- floorPlanId differs from stored floorPlanId
	this.updatePOI = function(POI) {
		var POIIdx = -1; 

		/* check if mandatory fields exist */
		if (POI.id === null ||
			POITYPEVALUES.indexOf(POI.POIType) === -1 ||
			POI.floorPlanId === null ||
			POI.locationX === null ||
			POI.locationY === null ||
			POI.floorPlanId === null) {
		    return null;
		} 

		for (var i in DataStorage) {
			if (DataStorage[i].id == POI.id) {
			    POIIdx = i;
			    break;
			} 
		}
		
		/* Test if POI.id was found. If not, return 0 */
		if (POIIdx === -1) {
		    return null;
		} 

		var cloneOfPOI = JSON.parse(JSON.stringify(POI));
		DataStorage[i] = cloneOfPOI; 
		return 1; 
	};


/* function deletePOI */
	// Input:
	//		id: mandatory integer
	// Returns:
	//		integer 1 if successful, 0 if POI doesn't exist
	//
	this.deletePOI = function(id) {

		/* Find POI index in the database */
		var POIIdx = -1; 
		var POI = {};
		
		for (var i in DataStorage) {
			if (DataStorage[i].id == id) {
			    POIIdx = i;
			    break;
			} 
		}
		
		/* Test if POI.id was found. If not, return 0. */
		if (POIIdx === -1) {
		    return 0;
		} 
		
		/* Take the last element of the list and replace the deleted POI with that */
		POI = DataStorage.pop();
		
		/* However, if the POI to be deleted is the last one, do not replace */
		if (i != DataStorage.length) {
		    DataStorage[i] = POI;
		} 
		return 1;
    };


/* function getPOIById */	
	// Input:
	//     id: integer
	// Returns: 
	//     Stored POI with the given id, or null if the id does not exist
	//
 	this.getPOIById = function(id) {
		var foundPOIIdx; 
		
		for ( i in DataStorage) {
			if (DataStorage[i].id == id) {
				var cloneOfPOI = JSON.parse(JSON.stringify(DataStorage[i]));
				return cloneOfPOI; 
			}
		}
		return null; 
    };
    
    
/* function getPOIsByFloorId */	
	// Input:
	//     floorId: mandatory string
	// Returns: 
	//     List of stored POIs within the given floor, or null if the floor id
	//	   does not exist, or if there are no POIs in the given floor
	//
 	this.getPOIsByFloorId = function(floorId) {
		var retPOIList = []; 
		for ( var i in DataStorage) {
			if (DataStorage[i].floorPlanId == floorId) {
				var cloneOfPOI = JSON.parse(JSON.stringify(DataStorage[i]));
				retPOIList.push(cloneOfPOI);
			}
		}
		return retPOIList; 
	};
	

/* function getPOIsByType */	
	// Input:
	//     floorId: mandatory string
	//     POIType: mandatory string within POITYPEVALUES
	// Returns: 
	//     List of all stored POIs (from all floors) of the given type, or null
	//	   if the POIType does not exist, or if there are no POIs of the given type
	//
	this.getPOIsByType = function(floorId, POIType) {
		var retPOIList = []; 
		
		if (POITYPEVALUES.indexOf(POI.POIType) === -1) {
		    return retPOIList;
		} 
		
		for (var i in DataStorage) {
			if (DataStorage[i].floorPlanId == floorId &&
				DataStorage[i].POIType == POIType) {
					var cloneOfPOI = JSON.parse(JSON.stringify(DataStorage[i]));
					retPOIList.push(cloneOfPOI);
				} 
		}
		return retPOIList; 		
	}


/* function getPOIsWithinRectangle */	
	// Input:
	//     floorId: mandatory string
	//     minX : mandatory integer >= 0
	//     minY : mandatory integer >= 0
	//     maxX : mandatory integer >= 0
	//     maxY : mandatory integer >= 0	
	// Returns: 
	//     List of all stored POIs within the given floor and within the given 
	//     rectangle including the min and max limits, or null if there are no POIs
	//	   within the floor & rectangle
	//
 	this.getPOIsWithinRectangle = function(floorId, minX, minY, maxX, maxY) {
		var retPOIList = []; 
		for (var i in DataStorage) {
			if (DataStorage[i].floorPlanId == floorId &&
				DataStorage[i].locationX >= minX &&
				DataStorage[i].locationX <= maxX &&
				DataStorage[i].locationY >= minY &&
				DataStorage[i].locationY <= maxY) {
					var cloneOfPOI = JSON.parse(JSON.stringify(DataStorage[i]));
					retPOIList.push(cloneOfPOI);
				} 
		}
		return retPOIList; 		
	};


/* function getNearestPOI */	
	// Input:
	//     floorId: mandatory string
	//     locationX : mandatory integer
	//     locationY : mandatory integer
	//     searchRadius : mandatory real 
	// Returns:
	//     POI which is nearest to the given location. The POI must be within
	//     the "searchRadius" distance from locationX and locationY. Returns null if
	//     the floor does not exist, or if there are no POIs in the floor. If two or 
	//	   more POIs are exactly at the same distance, one of them is selected randomly.
	//
 	this.getNearestPOI = function(floorId, locationX, locationY, searchRadius) {
		
		var nearestPOIIdx = -1; 
		var shortestDistance = Number.MAX_VALUE;
		var testDistance; 
		var xDif, yDif; 
		for (var i in DataStorage) {

			xDif = locationX - DataStorage[i].locationX; 
			yDif = locationY - DataStorage[i].locationY; 
			testDistance = Math.sqrt(xDif * xDif + yDif * yDif); 

			if (DataStorage[i].floorPlanId === floorId &&
				testDistance < shortestDistance &&
				testDistance < searchRadius)
			{			
				shortestDistance = testDistance; 
				nearestPOIIdx = i; 
			}
		}
		
		if (nearestPOIIdx == -1) {
		    /* No POIs found within the searchRadius */
		    return null;
		}
		
		var cloneOfPOI = JSON.parse(JSON.stringify(DataStorage[nearestPOIIdx]));
		return cloneOfPOI;
	};

	
/* function getNbrOfPOIs */
	// Input:
	//     none
	// Returns:
	//     Number of stored POIS
	//
	this.getNbrOfPOIs = function() {
		return DataStorage.length;
    };
	
}   // End of localPOIStorage class
