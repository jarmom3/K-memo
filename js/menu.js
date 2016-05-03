//
// menu.js
//
// Menu handling functions
//
// Jarmo Mäkelä 2015-11-20
// demo v3
//


function initProjectMenu() {

    var projCount;
    var ulElem;
    var liElem;
    var aElem;
    var prefix;
    var postfix;
    var onClickStr;
    
    projCount = docDb.getNbrOfProjects();
    ulElem = document.getElementById("navbarProjList");
    
    /* Create items (<li> element with <a> element inside) */
    for (i = 0; i < projCount; i++) {
        liElem = document.createElement("li");
        ulElem.appendChild(liElem);
        
        aElem = document.createElement("a");
        aElem.innerHTML = docDb.getProjectInfo(i);
        aElem.setAttribute("href", "#");
        
        /* Set the onclick function */
        onClickStr = "alert('Projektin valintaa ei vielä toteutettu');";
        aElem.setAttribute("onclick", onClickStr);
        
        liElem.appendChild(aElem);
    }
}


function initDocumentMenu() {

    var docCount;
    var ulElem;
    var liElem;
    var aElem;
    var prefix;
    var postfix;
    var onClickStr;
    
    docCount = docDb.getNbrOfDocuments();
    ulElem = document.getElementById("navbarDocList");
    
    /* Create items (<li> element with <a> element inside) */
    for (i = 0; i < docCount; i++) {
        liElem = document.createElement("li");
        ulElem.appendChild(liElem);
        
        aElem = document.createElement("a");
        aElem.innerHTML = docDb.getDocumentInfo(i).documentName;
        aElem.setAttribute("href", "#");
        
        /* Set the onclick function and a parameter for it */
        prefix = "initImage('";
        postfix = "');";
        onClickStr = prefix + docDb.getDocumentInfo(i).documentUrl + postfix;  
        aElem.setAttribute("onclick", onClickStr);
        
        liElem.appendChild(aElem);
    }
}


function initContextMenu() {
  
    var $contextMenu = $("#contextMenu");

    /* Show context menu when a floor plan is clicked */
    $("#floorPlanImg").on("click", function(e) {    
        var menuLeft;
        var menuTop;
                
        /*  Check the size of the window (visible area) and the menu */
        var windowWidth = document.body.clientWidth;
        var windowHeight = document.body.clientHeight;
        var menuWidth = $("#contextMenu").width();
        var menuHeight = $("#contextMenu").height();
        
        /* Pois can not be created in view-only documents */
        if (uiState.arePoisAccepted() == false) {
            return;
        } 
        
        /* Calculate where the context menu can be put. Take into account
           the space the click indicator needs. */
        if ((e.pageX + menuWidth + CLICK_ICON_SPACE) > (windowWidth)) {
            /* Put the menu left to the clicked point */
            menuLeft = e.pageX - menuWidth - CLICK_ICON_SPACE;
        } else {
            menuLeft = e.pageX + CLICK_ICON_SPACE;            
        }
                
        if ((e.pageY + menuHeight + CLICK_ICON_SPACE) > (windowHeight)) {
            /* Put the menu up to the clicked point */
            menuTop = e.pageY - menuHeight - CLICK_ICON_SPACE;
        } else {
            menuTop = e.pageY + CLICK_ICON_SPACE;
        }
    
        $contextMenu.css({
            display: "block",
            left: menuLeft,
            top: menuTop
        });
        
        uiState.setClickedX(e.pageX);
        uiState.setClickedY(e.pageY);        
        
        showClickIndicator();
        
        return false;
    });

    $contextMenu.on("click", "a", function() {
        $contextMenu.hide();
    });
  
}


/* Main menu selections */

function hideContextMenu() {

    /* Hide both the click indicator the and context menu */
    hideClickIndicator();
    $("#contextMenu").hide();
}


function selectProject() {

    hideContextMenu();
	$(".poiClass").remove() ; 
	db.deleteAllPOIs();
    alert("POI muisti tyhjennetty");
}


function taskList() {

    hideContextMenu();
    alert("Ei vielä toteutettu");
}


function uploadData() {

    hideContextMenu();
    alert("Ei vielä toteutettu");
}


function settings() {

    hideContextMenu();
    alert("Ei vielä toteutettu");
}
