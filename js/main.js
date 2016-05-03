//
// main.js
//
// General initialization functions etc.
//
// Jarmo Mäkelä 2015-11-20
// demo v3
//


/* Common initialization, run only during the page onload */
function mainInit() {

    var nbr;
    var name;
    var liElem;
    
    initDocStorage();
    initProjectMenu();
    initDocumentMenu();
    
    createImageArea();
	getPOIsFromDBtoDOM(); // in image.js
    createClickIndicator();
    
    /* Show the current project name */
    nbr = docDb.getNbrOfProjects();
    if (nbr < 1) {
        /* No projects in the database */
        alert("Ei yhtään projektia tietokannassa.");
        return;
    }
    else {
        /* Open the first project by default. This may be changed later. */
        name = docDb.getProjectInfo(0);
        document.getElementById("currentProject").innerHTML = name;
    }
    
    nbr = docDb.getNbrOfDocuments();
    if (nbr < 1) {
        /* No documents in the current project */
        alert("Ei yhtään dokumenttia.");
        return;
    }

    /* Open the SECOND document by default. JUST IN THE DEMO VERSION. */
    name = docDb.getDocumentInfo(1).documentName;
    document.getElementById("currentDocument").innerHTML = name;
        
    /* Show a document and make the related nav-tab active */
    //liElem = document.querySelector("li[data-docurl='img/demo-kerros1.png']");
    //liElem.setAttribute("class", "active");
    
    //$('li[data-docurl="demo-kerros1.png"]').addClass("active");
    initImage("img/demo-kerros1.png");
    initTouch();
}


/* This is needed in the demo version to have some data in the document storage. */
function initDocStorage() {
  
    docDb.clearProjectInfo();
    docDb.clearDocumentInfo();
    
    docDb.addProject("Asunto Oy Demokiinteistö");
    docDb.addProject("Demo Oy, tehdasrakennus");
    docDb.addProject("Firma Oy, pääkonttori");
    docDb.addDocument("Kellari", "img/demo-kellari.png", true);
    docDb.addDocument("Kerros-1", "img/demo-kerros1.png", true);
    docDb.addDocument("Ullakko", "img/demo-ullakko.png", true);
    docDb.addDocument("Asuntotaulukko", "img/taulukko.png", false);
    docDb.addDocument("Isännöitsijäntodistus", "img/todistus.png", false);
}


/* Create the nav tab HTML-elements *
function createNavTabs() {

    var docCount;
    var ulElem;
    var liElem;
    var aElem;
    var prefix;
    var postfix;
    var onClickStr;
    
    docCount = docDb.getNbrOfDocuments();
    
    /* Create the <ul> element *
    ulElem = document.createElement("ul");
    document.getElementById("mainView").appendChild(ulElem);
    ulElem.setAttribute("class", "nav nav-tabs");
    //ulElem.setAttribute("id", "tabList");
    
    /* Create items (<li> element with <a> element inside) *
    for (i = 0; i < docCount; i++) {
        liElem = document.createElement("li");
        ulElem.appendChild(liElem);
        
        /* A data-attribute is needed when setting a nav-tab active / non-active *
        liElem.setAttribute("data-docurl", docDb.getDocumentInfo(i).documentUrl);
        
        aElem = document.createElement("a");
        aElem.innerHTML = docDb.getDocumentInfo(i).documentName;
        aElem.setAttribute("href", "#");
        
        /* Set the onclick function and a parameter for it *
        prefix = "initImage('";
        postfix = "');";
        onClickStr = prefix + docDb.getDocumentInfo(i).documentUrl + postfix;
        
        aElem.setAttribute("onclick", onClickStr);
        liElem.appendChild(aElem);
    }
}*/


/* Create the element to hold the floorplan or other document */
function createImageArea() {
	
	$(document).ready(function(){
		
		/* Create img element having the floor plan or other document */
		$("#mainView").append("<img id='floorPlanImg'></img>"); 

		// Set asycronous callback for zoomLevel etc calculation
		// Note that these calculations can be done after the full 
		// floor plan image is fuly loaded
		$("#floorPlanImg").load(function() {
		    onloadNewImage();
		});
	});
	
	/* Enable picture dragging for touch displays */
	//$("#floorPlanImg").attr("draggable", "true");
	
    initContextMenu();
}


/* Click an image element for the click indicator. Initially hidden. */
function createClickIndicator() {

    var clickIndicatorElem;
    var parentElem;
    
    /* Create an image element for the click point indicator */
    clickIndicatorElem = document.createElement("img");
    clickIndicatorElem.style.position = 'absolute';
    
    parentElem = document.getElementById("mainView");  
    parentElem.appendChild(clickIndicatorElem);
    
    clickIndicatorElem.id = "idClickPoint";
    clickIndicatorElem.style.visibility = "hidden";
    clickIndicatorElem.style.display = "block";
    clickIndicatorElem.src = "img/clickpoint.png"; //CLICK_INDICATOR_ICON;
}


function selectDocument() {

    alert("vielä pitää toteuttaa dokumentin valinta...");
}
