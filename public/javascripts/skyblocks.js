//  SkyBlocks
//     A browser based tetris clone 
//     https://github.com/leemuro/skyblocks

var SkyBlocks = {};

//  SkyBlocks.controls
//     constants used only to identify the individual game controls

SkyBlocks.controls = {}
SkyBlocks.controls.left = 0;
SkyBlocks.controls.right = 1;
SkyBlocks.controls.down = 2;
SkyBlocks.controls.clockwise = 3;
SkyBlocks.controls.counterClockwise = 4;
SkyBlocks.controls.drop = 5;

//  SkyBlocks.controller
//     stores the state of something that the user controls the game with

SkyBlocks.controller = function() {
  var downs = {}; 
  this.sendDown = function( control ) { downs[ control ] = true; }
  this.sendUp = function( control ) { downs[ control ] = false; }
  this.isDown = function( control ) { return downs[ control ]; }

  this.update = function( state ) {
    state.controller = this;
  }
}

//  SkyBlocks.keyboard
//     sets up the user's keyboard to be used as the game controller

SkyBlocks.keyboard = function() {
  var me = this;
  $( window ).keydown( function( e ) { me.sendDown( e.keyCode ); } );
  $( window ).keyup( function( e ) { me.sendUp( e.keyCode ); } );
}
SkyBlocks.keyboard.prototype = new SkyBlocks.controller();

//  SkyBlocks.lines
//     returns an array of lines

SkyBlocks.lines = function( length ) {
  var lines = [];
  for( var i = 0; i < length; i++ )
    lines[ i ] = [];
  return lines;
}

//  SkyBlocks.figure
//     defines a shape of 4 blocks in different orientations

SkyBlocks.figure = function( width, height, orientations ) {
  this.width = width;
  this.height = height;

  this.hexToArray = function( hex ) {
    var orientation = new SkyBlocks.lines( height );
    var n = 0;
    for( var y = 0; y < height; y++ ) {
      for( var x = 0; x < width; x++ ) {
        var f = Math.pow( 2, ( width * height ) - 1 - n );
        if( ( hex & f ) / f > 0 )
          orientation[ y ].push( x );
        n++;
      }
    }
    return orientation;
  }

  this.orientations = [];
  for( var i = 0; i < orientations.length; i++ )
    this.orientations[ i ] = this.hexToArray( orientations[ i ] );
}

//  SkyBlocks.figures
//     store all the figures in an array

SkyBlocks.figures = [
  new SkyBlocks.figure( 3, 3, [ 0x78, 0x192, 0x3C, 0x93 ] ), // L
  new SkyBlocks.figure( 3, 3, [ 0x138, 0xD2, 0x39, 0x96 ] ), // J
  new SkyBlocks.figure( 3, 3, [ 0xB8, 0x9A, 0x3A, 0xB2 ] ), // T
  new SkyBlocks.figure( 4, 4, [ 0xF00, 0x4444 ] ), // I
  new SkyBlocks.figure( 3, 3, [ 0x1E, 0x99 ] ), // S
  new SkyBlocks.figure( 3, 3, [ 0x33, 0x5A ] ), // Z
  new SkyBlocks.figure( 2, 2, [ 0xF ] ) // O
];

//  SkyBlocks.next
//     stores the next figure that is about to enter the field

SkyBlocks.next = function() {
  this.figure = SkyBlocks.figures[ 0 ];

  this.update = function( state ) {
    state.next = this;
    if( state.pieceLanded ) {
      var rand = Math.floor( Math.random() * SkyBlocks.figures.length );
      this.figure = SkyBlocks.figures[ rand ];
    }
  }
}

//  SkyBlocks.field
//     main gameplay area where pieces fall and collect

SkyBlocks.field = function() {
  this.width = 10;
  this.lines = new SkyBlocks.lines( 20 );

  this.update = function( state ) {
    state.field = this;
  }

  this.outOfBounds = function( x, y ) {
    return x < 0 || x >= this.width || y < 0 || y >= this.lines.length;
  }
};

//  SkyBlocks.piece
//     the current figure that is in the field 

SkyBlocks.piece = function( figure, field ) {

  this.init = function( figure ) {
    this.x = Math.floor( ( field.width - figure.width ) / 2 );
    this.y = 0;
    this.orientation = 0;
    this.figure = figure;
  }
  this.init( figure );

  this.update = function( state ) {
    state.piece = this;
    if( state.pieceLanded )
      this.init( state.next.figure );
  }

  this.collides = function() {
    for( var y = 0; y < figure.height; y++ ) {
      for( var x = 0; x < this.figure.orientations[ this.orientation ][ y ].length; x++ ) {
        var fx = this.x + this.figure.orientations[ this.orientation ][ y ][ x ];
        var fy = this.y + y;
        if( field.outOfBounds( fx, fy ) || field.lines[ fy ].indexOf( fx ) >= 0 )
          return true;
      }
    }
    return false;
  }
}

//  SkyBlocks.gravity
//     moves the piece down in the field at a given rate

SkyBlocks.gravity = function() {
  this.update = function( state ) {
    state.pieceLanded = false;
    state.piece.y += state.level * ( state.elapsed / 1000.0 );
    while( state.piece.collides() ) {
      state.pieceLanded = true;
      state.piece.y--;
    }
  }
}

//  SkyBlocks.embedder
//     embeds pieces into the field when they land

SkyBlocks.embedder = function() {
  this.update = function( state ) {
    if( state.pieceLanded ) {
      for( var x = 0; x < state.piece.figure.width; x++ ) {
        for( var y = 0; y < state.piece.figure.height; y++ ) {
          var fx = Math.floor( state.piece.x + x );
          var fy = Math.floor( state.piece.y + y );
          var pieceBlock = state.piece.figure.orientations[ state.piece.orientation ][ x ][ y ];
          state.field.lines[ fy ].push( fx );
        }
      }
    }
  }
}

//  SkyBlocks.movement
//     base class to handle movement of the piece within the field

SkyBlocks.movement = function( attr, direction, control ) {
  this.update = function( state ) {
    if( state.controller.isDown( control ) ) {
      var initial = state.piece[ attr ];
      state.piece[ attr ] += direction;
      if( state.piece.collides() )
        state.piece[ attr ] = initial;
    }
  }
}
//  SkyBlocks.left
//     handles moving the piece to the left within the field

SkyBlocks.left = function() {}
SkyBlocks.left.prototype = new SkyBlocks.movement( 'x', -1, SkyBlocks.controls.left );


//  SkyBlocks.right
//     handles moving the piece to the right within the field

SkyBlocks.right = function() {}
SkyBlocks.right.prototype = new SkyBlocks.movement( 'x', 1, SkyBlocks.controls.right );

//  SkyBlocks.down
//     handles moving the piece to the down within the field

SkyBlocks.down = function() {}
SkyBlocks.down.prototype = new SkyBlocks.movement( 'y', 1, SkyBlocks.controls.down );

//  SkyBlocks.rotation
//     base class to handle rotation of the piece within the field

SkyBlocks.rotation = function( direction, control ) {
  this.update = function( state ) {
    if( state.controller.isDown( control ) ) {
      var initialOrientation = state.piece.orientation;
      state.piece.orientation += direction;
      if( state.piece.orientation < 0 )
        state.piece.orientation = state.piece.figure.orientations.length - 1;
      else if( state.piece.orientation == state.piece.figure.orientations.length )
        state.piece.orientation = 0;
      if( state.piece.collides() )
        state.piece.orientation = initialOrientation;
    }
  }
}

//  SkyBlocks.clockwise
//     handles rotating the piece clockwise within the field

SkyBlocks.clockwise = function() {}
SkyBlocks.clockwise.prototype = new SkyBlocks.rotation( -1, SkyBlocks.controls.clockwise );

//  SkyBlocks.counterClockwise
//     handles rotating the piece counter clockwise within the field

SkyBlocks.counterClockwise = function() {}
SkyBlocks.counterClockwise.prototype = new SkyBlocks.rotation( 1, SkyBlocks.controls.counterClockwise );

//  SkyBlocks.dropper
//     handles dropping pieces until they collide

SkyBlocks.dropper = function() {
  this.update = function( state ) {
    if( state.controller.isDown( SkyBlocks.controls.drop ) ) {
      while( !state.piece.collides() )
        state.piece.y++;
      state.piece.y--;
      state.pieceLanded = true;
    }
  }
}

//  SkyBlocks.clearer
//     clears lines in the field

SkyBlocks.clearer = function() {
  this.update = function( state ) {
    state.linesCleared = 0;
    if( state.pieceLanded ) {
      var y = state.field.lines.length - 1;
      while( y >= 0 ) {
        if( state.field.lines[ y ].length == state.field.width ) {
          state.field.lines.splice( y, 1 );
          state.field.lines.splice( 0, 0, [] );
          state.linesCleared++;
        }
        else y--;
      }
    }
  }
}

//  SkyBlocks.level
//     handles when to change levels

SkyBlocks.level = function( startLevel ) {
  this.level = startLevel;
  this.lines = 0;

  this.update = function( state ) {
    this.lines += state.linesCleared;
    this.level = startLevel + Math.floor( this.lines / 10.0 );
    state.level = this.level;
  }
}

//  SkyBlocks.score
//     score keeping logic

SkyBlocks.score = function() {
  this.score = 0;
  this.linePoints = [ 0, 4, 10, 30, 120 ];

  this.update = function( state ) {
    this.score += state.level * this.linePoints[ state.linesCleared ];
  }
}
