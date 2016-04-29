//
// spinner.js
//
// Spinner functions
//
// K-memo, 2015-10-22
// Jarmo Mäkelä
//

/* Uses the spin.js file located in the 'libs' directory  */


var kSpinner = null;


/* Use the following two functions to start and stop a spinner */

function spinnerStart() {
    if (!kSpinner) {
        /* Create a new spinner only if there isn't one already */
        kSpinner = createSpinner(document.body);
    } else {
        kSpinner.restart();
    }
}

function spinnerStop() {
	kSpinner.stop();
}


/* Internal function */
function createSpinner(targetElement) {

    var opts = {
        lines: 11,      // Number of spokes
        length: 30,     // Line length
        width: 10,      // Line thickness
        radius: 35,     // Inner circle radius
        corners: 1,     // Corner roundness (0..1)
        direction: 1,   // 1: clockwise, -1: counterclockwise
        color: "#9A9A9B",
        shadow: true,   // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
	};

	var spinner = new Spinner(opts).spin(targetElement);

	spinner.restart = function() {
		this.spin(targetElement);
	};

	return (spinner);
}
