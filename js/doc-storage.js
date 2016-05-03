//
// doc-storage.js
//
// Interface for the projects and their floorplans and other documents.
// At the moment provides just demo data which is stored on runtime memory.
//
// Jarmo Mäkelä, 2015-10-28
// demo v3
//


function documentInfoStorage() {

    var projectStorage = [];    // List of all projects visible to the user
    var documentStorage = [];   // List of documents in the current project


	// Input: -
	// Returns: -
	//
	this.clearProjectInfo = function() {
		projectStorage = []; 
    };

    
	// Input:
	//   projectName: String
	//   (Other fields to be added later, not needed in the demo version)
	// Returns: -
	//
	this.addProject = function(projectName) {
		projectStorage.push(projectName);
    };    


	// Input: -
	// Returns: Integer
	//
	this.getNbrOfProjects = function() {
		return projectStorage.length; 
    };


	// Input:
	//   index: Integer   
	// Returns: 
	//   name: String;   (Name is the only piece of information in the demo version)
	//
	this.getProjectInfo = function(index) {
		return projectStorage[index]; 
    };


	// Input: -
	// Returns: -
	//
	this.clearDocumentInfo = function() {
		documentStorage = []; 
    };


	// Input:
	//   documentName: String
	//   documentUrl:  String
	//   POIsAccepted: Boolean   (Can the user add POIs to the document or not)
	// Returns: -
	//
	this.addDocument = function(name, url, hasPOIs) {
	    var newDoc = {documentName: name, documentUrl: url, POIsAccepted: hasPOIs};
		documentStorage.push(newDoc);
    };    


	// Input: -
	// Returns: Integer
	//
	this.getNbrOfDocuments = function() {
		return documentStorage.length; 
    };


	// Input:
	//   index: Integer   
	// Returns: 
	//   documentName: String
	//   documentUrl:  String
	//   POIsAccepted: Boolean   (Can the user add POIs to the document or not)
	//
	this.getDocumentInfo = function(index) {
		return documentStorage[index]; 
    };

    
	// Input:
	//    url: String
	// Returns:
	//    null if no match found, or:
	//	  - documentName: String
	//    - documentUrl:  String
	//    - POIsAccepted: Boolean   (Can the user add POIs to the document or not)
	//
	this.findDocumentInfo = function(url) {
	    for (i = 0; i < documentStorage.length; i++) {
	        if (url == documentStorage[i].documentUrl) { 
		        return documentStorage[i];
		    }
		}
		return null;
    };


	// Input:
	//   url: String
	// Returns:
	//   null if no match found, or:
	//	 - documentName: String
	//   - documentUrl:  String
	//   - POIsAccepted: Boolean   (Can the user add POIs to the document or not)
	//
	this.findNextDocumentInfo = function(url) {
	    for (i = 0; i < documentStorage.length; i++) {
	        if (url == documentStorage[i].documentUrl) {
	        	            
	            if (i == documentStorage.length - 1) {
	                /* The current document is the last one. Return the first one. */
		            return documentStorage[0];
		        }
		        else {
		            /* Return the next document */
		            return documentStorage[i + 1];
		        }
		    }
		}
		return null;
    };


	// Input:
	//   url: String
	// Returns:
	//   null if no match found, or:
	//	 - documentName: String
	//   - documentUrl:  String
	//   - POIsAccepted: Boolean   (Can the user add POIs to the document or not) 
	//
	this.findPrevDocumentInfo = function(url) {
	    for (i = 0; i < documentStorage.length; i++) {
	        if (url == documentStorage[i].documentUrl) {
	        	            
	            if (i == 0) {
	                /* The current document is the first one. Return the last one. */
		            return documentStorage[documentStorage.length - 1];
		        }
		        else {
		            /* Return the previous document */
		            return documentStorage[i - 1];
		        }
		    }
		}
		return null;
    };


}   // End of documentInfoStorage class

var docDb = new documentInfoStorage;
