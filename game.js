// game.js for Perlenspiel 3.0

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-13 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!


var test = 0;
// note that this is a dict, and it uses : syntax
var LIFE = {
    DEBUG: false,
    RATE: 30,   // 60/60 = 1 per second
    BG_COLOR: PS.COLOR_RED,
    GRID_HEIGHT: 32,
    GRID_WIDTH: 32,

    ticks: 0,
    running: false,

    // store the location of active beads on the board
    beads: [],

    tick: function() {
        if (LIFE.running) {
            PS.statusText("This is tick #" + LIFE.ticks++);
            LIFE.progress();
            LIFE.draw();
        }
    },

    progress: function() {
    
        var len = LIFE.beads.length;

        var next = [];
        // build a new array of actives 

        // calculate all surviving cells
        for (var i = 0; i < LIFE.beads.length; i++) {
            var bead = LIFE.beads[i];
            // should this bead live?
            // must look at surrounding beads
            var count = LIFE.neighborCount(bead);
            
            if (count > 1 && count < 4) //this bead gets to live!
                next.push(bead);

            // PS.color(x, y, LIFE.BG_COLOR);
        }

        // calculate all new cell growth
        // note that this happens "at the same time", so it is driven
        // off the LIFE.beads set rather than "next"

        // since we have a list of all live cells (LIFE.beads), we can save
        // some time by only looking for new growth around them. So, first
        // we need a bounding box... (there may be a faster way to do this?)

        var minx = LIFE.GRID_WIDTH;
        var miny = LIFE.GRID_HEIGHT;
        var maxx = 0;
        var maxy = 0;

        for (var i = 0; i < LIFE.beads.length; i++) {
            var x = LIFE.beads[i][0];
            var y = LIFE.beads[i][1];

            if (x < minx)
                minx = x;
            if (x > maxx)
                maxx = x;
            if (y < miny)
                miny = y;
            if (y > maxy)
                maxy = y;
        }
       
        if (LIFE.beads.length > 0) {  
            LIFE.debug("bounding box: " + [minx, miny, maxx, maxy] + "\n");

            for (var x = minx - 1; x < maxx + 2; x++)
                for (var y = miny - 1; y < maxy + 2; y++) {
                    if (!LIFE.beadExists(x, y) && LIFE.neighborCount([x, y]) == 3)
                        next.push([x, y]);
                }

        } else {
            LIFE.debug("no life left!\n");
        }


        LIFE.beads = next;

    
    },
    neighborCount: function(bead) {
        // get the number of active neighbors
        var x = bead[0];
        var y = bead[1];

        var count = 0;
        
        // PS.debug("Beginning neighborCount() of bead: " + [x, y] + "\n");
        for (var ix = x - 1; ix < x + 2; ix++) {
            for (var iy = y - 1; iy < y + 2; iy++) {
                // PS.debug("checking: " + [ix, iy] + "\n");
                // don't check if it's the bead we are currently looking at!
                if (!(ix == x && iy == y) && LIFE.beadExists(ix, iy)) {
                        count++;
                        // PS.debug("found!\n");
                }
            }
        }

        return count;
    },

    beadExists: function(x, y) {
        var item;
        for (var i = 0; i < LIFE.beads.length; i++) {
            item = LIFE.beads[i];

            if (item[0] == x && item[1] == y) {
                return true;
            }
        } 
        return false;
    },

    draw: function() {
    
        PS.color(PS.ALL, PS.ALL, PS.DEFAULT);

        var len = LIFE.beads.length;

        for (var i = 0; i < LIFE.beads.length; i++) {
            var x = LIFE.beads[i][0];
            var y = LIFE.beads[i][1];

            if (x >= 0 && x < LIFE.GRID_WIDTH && y >= 0 && y < LIFE.GRID_HEIGHT)
                PS.color(x, y, LIFE.BG_COLOR);
        }
    
    },

    init: function() {
        LIFE.beads.push([1, 1]);
        LIFE.beads.push([1, 2]);
        LIFE.beads.push([1, 3]);

        LIFE.draw(); 
    },

    debug: function(message) {
        if (LIFE.DEBUG)
            PS.debug(message);
    },

};

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details


PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize( LIFE.GRID_WIDTH, LIFE.GRID_HEIGHT ); // replace with your own x/y values

	// Add any other initialization code you need here
    PS.statusText("Firin' up the thrusters");

    LIFE.init();
    PS.timerStart(LIFE.RATE, LIFE.tick);
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
    PS.color(x, y, PS.COLOR_RED);
    // PS.glyph(x, y, 'G');
    LIFE.beads.push([x, y]);
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
    PS.statusText("Hey don't leave!");
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyDown(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is pressed

    // begin the timer when a key is pressed. Any key will do.
    LIFE.running = !LIFE.running;
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

