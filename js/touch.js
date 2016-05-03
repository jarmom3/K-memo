//
// touch.js
//
// Function for handing touch events
//
// Jarmo Mäkelä 2015-11-24
// demo v3
//


//$(document).ready(function() {
var pinchCounter = 1;
var panCounter = 0;

function initTouch() {

    var elem = document.getElementById('floorPlanImg');
    var mc;
    var swipe;
    var pan;
    var pinch;
    var tap;
    
	var $contextMenu = $("#contextMenu");
    
    mc = new Hammer.Manager(elem);
	 
    /* Add a swipe recognizer for chancing the displayed image *
    swipe = new Hammer.Swipe();
    mc.add(swipe);

    mc.on('swipeleft', function(event){
       swipeLeft();
    });

    mc.on('swiperight', function(event){
        swipeRight();  
    });*/

    
    /* Add pan and swipe recognizer */
    pan = new Hammer.Pan();
    mc.add(pan);
    
    mc.on('pan', function(event){
        panCounter++;
        
        if (event.isFinal == true) {
            panCounter = 0;
            if (event.velocityX > 3) {
                swipeLeft();
            }
            else if (event.velocityX < -3) {
                swipeRight();
            }
            else { /* Pan gesture */
                moveImage(event.deltaX, event.deltaY);
            }
        }
        /*else {
            moveImage();            
        }*/
    });

    
    /*Create a pinch recognizer for zooming in and out */
    pinch = new Hammer.Pinch();
    mc.add(pinch);
    
    mc.on('pinch', function(event) {
        if (pinchCounter == 1) {    
            if (event.scale > 1) {
                pinchZoomIn(1.01);
            }
            else {
                pinchZoomOut(0.99);
            }
            pinchCounter++;
        }
        else if (pinchCounter == 5) {
            pinchCounter = 1;
        } 
        else {
            pinchCounter++;
        }
    });
    
        
    /* Show the context menu when the picture is clicked (or tapped) */
    tap = new Hammer.Tap();
    mc.add(tap);
    
    mc.on('tap', function(event) {
                
        var menuLeft;
        var menuTop;
 //       var $contextMenu = $("#contextMenu");
                
        /*  Check the size of the window (visible area) and the menu */
        var windowWidth = document.body.clientWidth;
        var windowHeight = document.body.clientHeight;
        var menuWidth = $contextMenu.width();
        var menuHeight = $contextMenu.height();
        
        /* Pois can not be created in view-only documents */
        if (uiState.arePoisAccepted() == false) {
            return;
        } 
                
        /* Calculate where the context menu can be put. Take into account
           the space the click indicator needs. */
        if ((event.center.x + menuWidth + CLICK_ICON_SPACE) > (windowWidth)) {
            /* Put the menu left to the clicked point */
            menuLeft = event.center.x - menuWidth - CLICK_ICON_SPACE;
        }
        else {
            menuLeft = event.center.x + CLICK_ICON_SPACE;            
        }
                
        if ((event.center.y + menuHeight + CLICK_ICON_SPACE) > (windowHeight)) {
            /* Put the menu up to the clicked point */
            menuTop = event.center.y - menuHeight - CLICK_ICON_SPACE;
        }
        else {
            menuTop = event.center.y + CLICK_ICON_SPACE;
        }
      
        $contextMenu.css({
            display: "block",
            left: menuLeft,
            top: menuTop
        });
        
        uiState.setClickedX(event.center.x);
        uiState.setClickedY(event.center.y);        
        
        showClickIndicator();
    });
    
    $contextMenu.on("click", "a", function() {
        $contextMenu.hide();
    });
    
}


function swipeLeft() {

    var next;
    
    next = docDb.findNextDocumentInfo(uiState.getCurrentDoc());
    initImage(next.documentUrl);
}


function swipeRight() {

    var prev;
    
    prev = docDb.findPrevDocumentInfo(uiState.getCurrentDoc());
    initImage(prev.documentUrl);
}


/* Image moving is implemented by changing the left and top margins */
function moveImage(deltaX, deltaY) {

    var newMarginLeft;
    var newMarginTop;
    var imgElem = document.getElementById("floorPlanImg");
    
    /* In initial state there is no margin at all */
    if (imgElem.style.marginLeft == "") {
        newMarginLeft = deltaX + "px";
    }
    else {
        newMarginLeft = parseInt(imgElem.style.marginLeft, 10) + deltaX + "px";
    }
    
    /* In initial state there is no margin at all */
    if (imgElem.style.marginTop == "") {
        newMarginTop = deltaY + "px";
    }
    else {
        newMarginTop = parseInt(imgElem.style.marginTop, 10) + deltaY + "px";
    }
    
    imgElem.style.marginLeft = newMarginLeft;
    imgElem.style.marginTop = newMarginTop;
}
