//
// main.js
//
// General initialization functions, global variables etc.
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//


/* Global variables */
var db = new localPOIStorage;
var docInfo = new documentInfoStorage;


function mainInit() {

	window.onbeforeunload = function(e) {
		var e = e || window.event;
		var msg = "Haluatko poistua K-memo-palvelusta?";

		// For IE and Firefox
		if (e) {
			e.returnValue = msg;
			return;
		}

		// For Safari / Chrome
		return msg;
	};
		
	/* Set the main window current property name */
	document.getElementById("idProject").innerHTML = "Asunto Oy Demokiinteistö";
	document.getElementById("idDocument").innerHTML = "Kerros-1";

    initMenuData();
	createDocumentMenuItems();
	createToolsMenuItems();
		
	initImage('img/demo-kerros1.png');
}
