//  SkyBlocks
//     A browser based tetris clone 
//     https://github.com/leemuro/skyblocks

var SkyBlocks = {};

//  SkyBlocks.blocks
//     returns an empty array of blocks

SkyBlocks.blocks = function( width, height ) {
  var blocks = [];
  for( var x = 0; x < width; x++ ) {
    blocks[ x ] = [];
    for( var y = 0; y < height; y++ )
      blocks[ x ][ y ] = 0;
  }
  return blocks;
}

//  SkyBlocks.field
//     main gameplay area where pieces fall and collect

SkyBlocks.field = function() {
  this.width = 10;
  this.height = 20;
  this.blocks = new SkyBlocks.blocks( this.width, this.height );

  this.outOfBounds = function( x, y ) {
    return x < 0 || x >= this.width || y < 0 || y >= this.height;
  }
};

//  SkyBlocks.figure
//     defines a shape of 4 blocks in different orientations

SkyBlocks.figure = function( width, height, orientations ) {
  this.width = width;
  this.height = height;

  this.hexToArray = function( hex ) {
    var orientation = new SkyBlocks.blocks( width, height );
    var n = 0;
    for( var y = 0; y < height; y++ ) {
      for( var x = 0; x < width; x++ ) {
        var f = Math.pow( 2, ( width * height ) - 1 - n );
        orientation[ x ][ y ] = ( hex & f ) / f;
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
  new SkyBlocks.figure(3, 3, [ 0x3C, 0x192, 0x78, 0x93 ]), // L
  new SkyBlocks.figure(3, 3, [ 0x138, 0xD2, 0x39, 0x96 ]), // J
  new SkyBlocks.figure(3, 3, [ 0xB8, 0x9A, 0x3A, 0xB2 ]), // T
  new SkyBlocks.figure(4, 4, [ 0xF00, 0x4444 ]), // I
  new SkyBlocks.figure(3, 3, [ 0x1E, 0x99 ]), // S
  new SkyBlocks.figure(3, 3, [ 0x33, 0x5A ]), // Z
  new SkyBlocks.figure(2, 2, [ 0xF ]) // O
];

//  SkyBlocks.next
//     stores the next figure that is about to enter the field

SkyBlocks.next = function() {
  this.figure = SkyBlocks.figures[ 0 ];

  this.update = function( state ) {
    if( state.pieceLanded ) {
      var rand = Math.floor( Math.random() * SkyBlocks.figures.length );
      this.figure = SkyBlocks.figures[ rand ];
    }
  }
}

//  SkyBlocks.piece
//     a positioned figure in a field that handles collision detection

SkyBlocks.piece = function( figure, field ) {
  this.blocks = figure.orientations[ 0 ];
  this.x = Math.floor( ( field.width - figure.width ) / 2 );
  this.y = 0;

  this.collides = function() {
    for( var x = 0; x < figure.width; x++ ) {
      for( var y = 0; y < figure.height; y++ ) {
        var fx = this.x + x;
        var fy = this.y + y;
        if( this.blocks[ x ][ y ] == 0 )
          continue;
        if( field.outOfBounds( fx, fy ) || field.blocks[ fx ][ fy ] > 0 )
          return true;
      }
    }
    return false;
  }
}

//  SkyBlocks.left
//     handles moving the piece to the left within the field

SkyBlocks.left = function() {
  this.update = function( state ) {
    if( state.controller.isDown( SkyBlocks.controls.left ) ) {
      state.piece.x -= 1;
      if( state.piece.collides() )
        state.piece.x += 1;
    }
  }
}

//  SkyBlocks.right
//     handles moving the piece to the right within the field

SkyBlocks.right = function() {
  this.update = function( state ) {
    if( state.controller.isDown( SkyBlocks.controls.right ) ) {
      state.piece.x += 1;
      if( state.piece.collides() )
        state.piece.x -= 1;
    }
  }
}

//  SkyBlocks.down
//     handles moving the piece to the down within the field

SkyBlocks.down = function() {
  this.update = function( state ) {
    if( state.controller.isDown( SkyBlocks.controls.down ) ) {
      state.piece.y += 1;
      if( state.piece.collides() )
        state.piece.y -= 1;
    }
  }
}

//  SkyBlocks.clearer
//     clears lines in the field

SkyBlocks.clearer = function( field ) {
  this.update = function( e ) {
    if( !e.pieceLanded )
      return { linesCleared: 0 }
    this.clear();
    return { linesCleared: this.linesCleared }
  }

  this.clear = function() {
    this.blocks = new SkyBlocks.blocks( field.width, field.height );
    this.linesCleared = 0;
    for( var y = field.height - 1; y >= 0; y-- )
      this.clearLine( y );
    field.blocks = this.blocks;
  }

  this.clearLine = function( y ) {
    if( this.lineCompleted( y ) )
      this.linesCleared++;
    else this.copyLine( y );
  }

  this.copyLine = function( y ) {
    for( var x = 0; x < field.width; x++ )
      this.blocks[ x ][ y + this.linesCleared ] = field.blocks[ x ][ y ];
  }

  this.lineCompleted = function( y ) {
    for( var x = 0; x < field.width; x++ )
      if( field.blocks[ x ][ y ] == 0 ) 
        return false;
    return true;
  }
}

//  SkyBlocks.controls
//     constants used only to identify the individual game controls

SkyBlocks.controls = {}
SkyBlocks.controls.left = 0;
SkyBlocks.controls.right = 1;
SkyBlocks.controls.down = 2;
SkyBlocks.controls.rotateClockwise = 3;
SkyBlocks.controls.rotateCounterClockwise = 4;
SkyBlocks.controls.drop = 5;

//  SkyBlocks.controller
//     stores the state of something that the user controls the game with

SkyBlocks.controller = function() {
  var downs = {}; 
  this.sendDown = function( control ) { downs[ control ] = true; }
  this.sendUp = function( control ) { downs[ control ] = false; }
  this.isDown = function( control ) { return downs[ control ]; }
}

//  SkyBlocks.keyboard
//     sets up the user's keyboard to be uses as the game controller

SkyBlocks.keyboard = function() {
  var me = this;
  $( window ).keydown( function( e ) { me.sendDown( e.keyCode ); } );
  $( window ).keyup( function( e ) { me.sendUp( e.keyCode ); } );
}
SkyBlocks.keyboard.prototype = new SkyBlocks.controller();
