//
// documentInfoStorage.js
//
// Runtime information store about the projects and their floorplans and other documents
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


function documentInfoStorage() {

    var projectStorage = [];   // List of all projects visible to the user
    var documentStorage = [];   // List of documents in the current project
    
    
/* function clearProjectInfo */
	// Input:
	//     none  
	// Returns: 
	//     none
	//
	this.clearProjectInfo = function() {
		projectStorage = []; 
    };


/* function addProject */
	// Input:
	//     projectName: string
	//     - Other fields to be added later, not needed in the demo version
	// Returns:
	//     none
	//
	this.addProject = function(projectName) {
		projectStorage.push(projectName);
    };    


/* function getNbrOfProjects */
	// Input:
	//     none
	// Returns:
	//     integer
	//
	this.getNbrOfProjects = function() {
		return projectStorage.length; 
    };


/* function getProjectInfo */
	// Input:
	//     index: integer   
	// Returns: 
	//     name: string   - Name is the only piece of information in the demo version.
	//
	this.getProjectInfo = function(index) {
		return projectStorage[i]; 
    };


/* function clearDocumentInfo */
	// Input:
	//     none  
	// Returns: 
	//     none
	//
	this.clearDocumentInfo = function() {
		documentStorage = []; 
    };


/* function addDocument */
	// Input:
	//     documentName: string
	//     documentUrl: string
	//     POIsAccepted: boolean   - Can the user add POIs to the document or not
	// Returns:
	//		none
	//
	this.addDocument = function(name, url, hasPOIs) {
	    var newDoc = {documentName: name, documentUrl: url, POIsAccepted: hasPOIs};
		documentStorage.push(newDoc);
    };    


/* function getNbrOfDocuments */
	// Input:
	//     none
	// Returns:
	//     integer
	//
	this.getNbrOfDocuments = function() {
		return documentStorage.length; 
    };


/* function getDocumentInfo */
	// Input:
	//     index: integer   
	// Returns: 
	//     documentName: string
	//     documentUrl: string
	//     POIsAccepted: boolean   - Can the user add POIs to the document or not 
	//
	this.getDocumentInfo = function(index) {
		return documentStorage[i]; 
    };

  
/* function findDocumentInfo */
	// Input:
	//     url: string
	// Returns:
	//     documentName: string
	//     documentUrl: string
	//     POIsAccepted: boolean   - Can the user add POIs to the document or not
	//     - If no match found, returns null
	//
	this.findDocumentInfo = function(name) {
	    for (i = 0; i < documentStorage.length; i++) {
	        if (name == documentStorage[i].documentUrl) { 
		        return documentStorage[i];
		    }
		}
		return null;
    };
    
}   // End of documentInfoStorage class
