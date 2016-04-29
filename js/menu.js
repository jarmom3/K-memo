//
// menu.js
//
// Main view dropdown menu and context menu functions
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


function initMenuData() {
    docInfo.clearProjectInfo();
    docInfo.clearDocumentInfo();
    
    /* Add some hard-coded content for demo purposes */
    docInfo.addProject("Asunto Oy Demokiinteistö");
    docInfo.addProject("Demo Oy, tehdasrakennus");
    docInfo.addProject("Firma Oy, pääkonttori");
    docInfo.addDocument("Kellari", "img/demo-kellari.png", true);
    docInfo.addDocument("Kerros-1", "img/demo-kerros1.png", true);
    docInfo.addDocument("Ullakko", "img/demo-ullakko.png", true);
    docInfo.addDocument("Asuntotaulukko", "img/taulukko.png", false);
    docInfo.addDocument("Isännöitsijäntodistus", "img/todistus.png", false);
}


function createDocumentMenuItems() {
    var docCount = docInfo.getNbrOfDocuments();
    var ulElem;
    var liElem;
    var spanElem;
    var menuTitle;
    var prefix = "closeDocumentMenu(); initImage('";
    var postfix = "');";
    var onClickStr;
    
    /* Create the <ul> element */
    ulElem = document.createElement("ul");
    ulElem.id = "documentMenu";
    ulElem.style.zIndex = "9999";
    menuTitle = document.getElementById("menuLi1");
    menuTitle.appendChild(ulElem);
    
    /* Create items (<li> element with <span> element inside) for the document menu */
    for (i = 0; i < docCount; i++) {
        liElem = document.createElement("li");
        ulElem.appendChild(liElem);
        
        spanElem = document.createElement("span");
        spanElem.innerHTML = docInfo.getDocumentInfo(i).documentName;
        
        onClickStr = prefix + docInfo.getDocumentInfo(i).documentUrl + postfix;
        spanElem.setAttribute("onClick", onClickStr);
        liElem.appendChild(spanElem);
    }
}


function closeDocumentMenu() {
    document.getElementById("documentMenu").style.zIndex = "-9999";
}


function createToolsMenuItems() {
    var ulElem;
    var liElem;
    var spanElem;
    var onClickStr = "closeToolsMenu(); alert('Ei vielä toteutettu');"
    var menuOptions = [
        "Valitse projekti",
        "Tehtävälista",
        "Haku",
        "Tietojen lähetys",
        "Asetukset"
    ];
    
    /* Create the <ul> element */
    ulElem = document.createElement("ul");
    ulElem.id = "toolsMenu";
    ulElem.style.zIndex = "9999";
    menuTitle = document.getElementById("menuLi2");
    menuTitle.appendChild(ulElem);
    
    /* Create items (<li> element with <span> element inside) for the tools menu */
    for (i = 0; i < menuOptions.length; i++) {
        liElem = document.createElement("li");
        ulElem.appendChild(liElem);
        spanElem = document.createElement("span");
        spanElem.innerHTML = menuOptions[i];
        spanElem.setAttribute("onClick", onClickStr);
        liElem.appendChild(spanElem);
    }
}

function closeToolsMenu() {
    document.getElementById("toolsMenu").style.zIndex = "-9999";
}


$(document).ready(function() {
    $("#mainViewImage").bind('click', openSubMenu);

	$('.mainMenu > li').bind('mouseover', openSubMenu);
	$('.mainMenu > li').bind('click', openSubMenu);
	$('.mainMenu > li').bind('mouseout', closeSubMenu);
	
	function openSubMenu() {
	    document.getElementById("documentMenu").style.display = 'initial';
	    document.getElementById("toolsMenu").style.display = 'initial';
		$(this).find('ul').css('visibility', 'visible');
	}

	function closeSubMenu() {
	    document.getElementById("documentMenu").style.zIndex = "9999";
	    document.getElementById("toolsMenu").style.zIndex = "9999";
		$(this).find('ul').css('visibility', 'hidden');	
	}   
});


/* mainView context menu */
$(document).ready(function() {
    $('#mainViewImage').click(function(e)  {

        var clickX;   /* X-coordinate of the clicked point */
        var clickY;   /* Y-coordinate of the clicked point */
        var menuTop;  /* X-coordinate of the menu top left corner */
        var menuLeft; /* Y-coordinate of the menu top left corner */
        
        /* Do not accept clicks if a modal dialog is on display */    
        if (uiState.isModalOn() == true) {
            return;
        }
        
        /* In case the click indicator is left on display, remove it */
        hideClickIndicator();
    
        /* Context menu is not displayed if POIs are not allowed in the document */
        if (uiState.arePoisAccepted() != true) {
            return;        
        } 
        
        /*  Check the size of the window (visible area) and the menu */
        var windowWidth = document.body.clientWidth;
        var windowHeight = document.body.clientHeight;
        var menuWidth = $("#floorPlanContextMenu").width();
        var menuHeight = $("#floorPlanContextMenu").height();

        clickX = e.pageX;
        clickY = e.pageY;
        
        uiState.setClickedX(clickX);
        uiState.setClickedY(clickY);
        
        /* Put an indicator on display to show the clicked point */
        showClickIndicator();
        
        /* Calculate where the context menu can be put. Take into account
           the space the click indicator needs. */
        if ((clickX + menuWidth + CLICK_ICON_SPACE) > (windowWidth)) {
            /* Put the menu left to the clicked point */
            menuLeft = clickX - menuWidth - CLICK_ICON_SPACE;
        } else {
            menuLeft = clickX + CLICK_ICON_SPACE;            
        }
                
        if ((clickY + menuHeight + CLICK_ICON_SPACE) > (windowHeight)) {
            /* Put the menu up to the clicked point */
            menuTop = clickY - menuHeight - CLICK_ICON_SPACE;
        } else {
            menuTop = clickY + CLICK_ICON_SPACE;
        }
        
        $("#floorPlanContextMenu").css({top: menuTop, left: menuLeft, position:'absolute'});
        $("#floorPlanContextMenu").show();
    });
    
    $("#floorPlanContextMenu").bind('mouseleave', closeContextMenu);
    
    function closeContextMenu () {
        hideClickIndicator();
        $("#floorPlanContextMenu").hide();
    }
});
   

$(document).ready(function() {
    $('span').click(function(e)  {
        $("#floorPlanContextMenu").hide();
    });
});
