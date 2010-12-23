/*
 * SkyBlocks
 * A browser based tetris clone
 *
 * Written by Lee Muro
 * https://github.com/leemuro/skyblocks
 */

var SkyBlocks = {};

/* 
 * Object attribute helper
 * dynamically add an attribute get/set method to an object
 */
Object.prototype.attr = function( name, initialValue ) {
  this[ '_' + name ] = initialValue;
  this[ name ] = function( val ) { 
    if( typeof val == 'undefined' )
      return this[ '_' + name ];
    this[ '_' + name ] = val;
    var changedCallback = this[ '_' + name + 'Changed' ];
    if( changedCallback )
      changedCallback();
    return val;
  }
}

/*
 * SkyBlocks.grid
 * a grid of blocks
 */
SkyBlocks.grid = function( width, height, blockValue, hex ) {
  var self = this;

  self.attr( 'width', width );
  self.attr( 'height', height );
  self.attr( 'blocks', new Array( self.width() ) );

  // convert the hex code into an array using binary math
  var n = 0, size = ( self.width() * self.height() );
  for( var y = 0; y < self.height(); y++ ) {
    for( var x = 0; x < self.width(); x++ ) {
      if( !self.blocks()[x] ) self.blocks()[x] = new Array( self.height() );
      var f = Math.pow( 2, size - 1 - n );
      self.blocks()[x][y] = ( ( hex & f ) / f ) > 0 ? blockValue : 0;
      n++;
    }
  }
}

/*
 * SkyBlocks.field
 * a grid representing the main game area
 */
SkyBlocks.field = function() {
  var self = this;

  self.attr( 'width', 10 );
  self.attr( 'height', 16 );
  self.attr( 'grid', new SkyBlocks.grid( self.width(), self.height(), 0x0 ) );
  self.attr( 'gravity', 0.0 );

  self.outOfBounds = function( x, y ) {
    return x < 0 || x >= self.width() || y < 0 || y >= self.height();
  }

  self.clearLines = function() {
    var newGrid = new SkyBlocks.grid( self.width(), self.height(), 0x0 );
    for( var y = newGridY = self.height() - 1, lines = 0; y >= 0; y-- ) {
      if( self.lineCompleted( y ) )
        lines++;
      else {
        for( var x = 0; x < self.width(); x++ )
          newGrid.blocks()[x][newGridY] = self.grid().blocks()[x][y];
        newGridY--;
      }
    }
    self.grid( newGrid );
    return lines;
  }

  self.lineCompleted = function( y ) {
    for( var x = 0; x < self.width(); x++ ) {
      if( self.grid().blocks()[x][y] == 0 )
        return false;
    }
    return true;
  }

}

/* 
 * SkyBlocks.figure
 * a figure represented in multiple rotations by grids
 */
SkyBlocks.figure = function( width, height, rotations ) {
  var self = this;

  self.attr( 'value', SkyBlocks.figures.length + 1 );
  self.attr( 'width', width );
  self.attr( 'height', height );
  self.attr( 'rotations', rotations );
  self.attr( 'grids', [] );

  // convert the hex rotations into actual grids
  for( var i = 0; i < self.rotations().length; i++ ) {
    var grid = new SkyBlocks.grid( self.width(), self.height(), self.value(), self.rotations()[i] );
    self.grids()[i] = grid;
  }

  SkyBlocks.figures.push( self );
}

/* 
 * define all the standard figures
 * l, j, t, i, s, z, o
 */
SkyBlocks.figures = [];
SkyBlocks.lFigure = new SkyBlocks.figure( 3, 3, [ 0x3C, 0x192, 0x78, 0x93 ] );
SkyBlocks.jFigure = new SkyBlocks.figure( 3, 3, [ 0x138, 0xD2, 0x39, 0x96 ] ); 
SkyBlocks.tFigure = new SkyBlocks.figure( 3, 3, [ 0xB8, 0x9A, 0x3A, 0xB2 ] );
SkyBlocks.iFigure = new SkyBlocks.figure( 4, 4, [ 0xF00, 0x4444 ] ); 
SkyBlocks.sFigure = new SkyBlocks.figure( 3, 3, [ 0x1E, 0x99 ] );
SkyBlocks.zFigure = new SkyBlocks.figure( 3, 3, [ 0x33, 0x5A ] );
SkyBlocks.oFigure = new SkyBlocks.figure( 2, 2, [ 0xF ] );

// TODO: Test this randomness
SkyBlocks.figure.random = function() {
  return SkyBlocks.figures[ Math.floor( Math.random() * SkyBlocks.figures.length ) ];
}

/* 
 * SkyBlocks.piece
 * a figure that can be manipulated and interacts with a field
 */
SkyBlocks.piece = function( figure, field ) {
  var self = this;

  self.attr( 'figure', figure );
  self.attr( 'field', field );
  self.attr( 'x', Math.floor( ( field.width() - figure.width() ) / 2 ) );
  self.attr( 'y', 0 );
  self.attr( 'width', figure.width() );
  self.attr( 'height', figure.height() );
  self.attr( 'rotationIndex', 0 );
  self.attr( 'dropped', null );

  self.grid = function() { 
    return self.figure().grids()[ self.rotationIndex() ]; 
  }

  self._rotationIndexChanged = function() {
    if( self.rotationIndex() == self.figure().grids().length )
      self.rotationIndex( 0 );
    else if( self.rotationIndex() < 0 )
      self.rotationIndex( self.figure().grids().length - 1 );
  }

  self.transform = function( transformation ) {
    self[ transformation[0] ]( self[ transformation[0] ]() + transformation[1] );
    if( self.collides() )
      self[ transformation[0] ]( self[ transformation[0] ]() - transformation[1] );
  }

  self.drop = function() {
    var initialY = self.y();
    while( !self.collides() )
      self.y( self.y() + 1 );
    var newY = self.y( self.y() - 1 );
    if( self.dropped() )
      self.dropped()( newY - initialY );
  }

  self.embed = function() {
    for( var x = 0; x < self.width(); x++ ) {
      for( var y = 0; y < self.height(); y++ ) {
        var fieldX = self.x() + x;
        var fieldY = self.y() + y;
        if( self.field().outOfBounds( fieldX, fieldY ) ) 
          continue;
        var block = self.grid().blocks()[x][y];
        if( block > 0 )
          field.grid().blocks()[fieldX][fieldY] = block;
      }
    }
  }

  self.collides = function() {
    for( var x = 0; x < self.width(); x++ ) {
      for( var y = 0; y < self.height(); y++ ) {
        var fieldX = self.x() + x;
        var fieldY = self.y() + y;
        if( self.grid().blocks()[x][y] == 0 )
          continue;
        if( self.field().outOfBounds( fieldX, fieldY ) )
          return true;
        if( field.grid().blocks()[fieldX][fieldY] > 0 )
          return true;
      }
    }
    return false;
  }

  self.grounded = function() {
    self.y( self.y() + 1 );
    var grounded = self.collides();
    self.y( self.y() - 1 );
    return grounded;
  }

  self.update = function( elapsed ) {
    // apply field gravity
    var initialY = self.y();
    self.y( self.y() + ( elapsed / 1000.0 ) * field.gravity() ); 
    if( self.collides() ) {
      self.y( initialY );
      self.drop();
    }
  }
}

/*
 * Piece transformations
 */
SkyBlocks.piece.transformations = {}
SkyBlocks.piece.transformations.clockwise = [ 'rotationIndex', -1 ];
SkyBlocks.piece.transformations.counterClockwise = [ 'rotationIndex', 1 ];
SkyBlocks.piece.transformations.left = [ 'x', -1 ];
SkyBlocks.piece.transformations.right = [ 'x', 1 ];
SkyBlocks.piece.transformations.down = [ 'y', 1 ]

/*
 * SkyBlocks.game
 * coordinates the actual gameplay
 */
SkyBlocks.game = function() {
  var self = this;

  self.newPiece = function() {
    var piece = new SkyBlocks.piece( self.nextFigure(), self.field() );
    // increase the score when a piece is dropped
    piece.dropped( function( linesDropped ) {
      self.score( self.score() + Math.floor( linesDropped / 2 ) * self.level() );
    });
    self.nextFigure( SkyBlocks.figure.random() );
    return piece;
  }

  self.attr( 'lines', 0 );
  self.attr( 'score', 0 );
  self.attr( 'level', 0 );
  self.attr( 'field', new SkyBlocks.field() );
  self.attr( 'nextFigure', new SkyBlocks.figure.random() );
  self.attr( 'piece', self.newPiece() );

  self._levelChanged = function() {
    self.field().gravity( self.level() );
  }

  // start at level 1
  self.level( 1 );

  self.over = function() {
    return self.piece().collides();
  }

  self.update = function( elapsed ) {
    self.piece().update( elapsed );
    if( self.piece().grounded() ) {
      self.piece().embed();
      self.piece( self.newPiece() );
      var linesCleared = self.field().clearLines();
      self.lines( self.lines() + linesCleared );
      self.score( self.score() + SkyBlocks.linePoints[linesCleared] * self.level() );
      self.level( Math.floor( self.lines() / 10 ) + 1 );
    }
  }
}

SkyBlocks.linePoints = [ 0, 10, 25, 60, 150 ];
