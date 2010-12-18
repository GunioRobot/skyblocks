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
}

/* 
 * SkyBlocks.figure
 * a figure represented in multiple transformations by grids
 */
SkyBlocks.figure = function( width, height, transforms ) {
  var self = this;

  self.attr( 'value', SkyBlocks.figures.length + 1 );
  self.attr( 'width', width );
  self.attr( 'height', height );
  self.attr( 'transforms', transforms );
  self.attr( 'grids', [] );

  // convert the hex transforms into actual grids
  for( var i = 0; i < self.transforms().length; i++ ) {
    var grid = new SkyBlocks.grid( self.width(), self.height(), self.value(), self.transforms()[i] );
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
 * SkyBlocks.widget
 * a figure that can be manipulated and interacts with a field
 */
SkyBlocks.widget = function( figure, field ) {
  var self = this;

  self.attr( 'figure', figure );
  self.attr( 'field', field );
  self.attr( 'x', Math.floor( ( field.width() - figure.width() ) / 2 ) );
  self.attr( 'y', -figure.height() );
  self.attr( 'width', figure.width() );
  self.attr( 'height', figure.height() );
  self.attr( 'rotationIndex', 0 );

  self.grid = function() { 
    return self.figure().grids()[ self.rotationIndex() ]; 
  }

  self.rotate = function( direction ) {
    var rotate = function( d ) {
      self.rotationIndex( self.rotationIndex() + d );
      if( self.rotationIndex() == self.figure().grids().length )
        self.rotationIndex( 0 );
      else if( self.rotationIndex() < 0 )
        self.rotationIndex( self.figure().grids().length - 1 );
    }
    rotate( direction );
    if( self.collides() )
      rotate( -direction );
  }

  self.left = function() {
    self.x( self.x() - 1 );
    if( self.collides() )
      self.x( self.x() + 1 );
  }

  self.right = function() {
    self.x( self.x() + 1 );
    if( self.collides() )
      self.x( self.x() - 1 );
  }

  self.embed = function() {
    for( var x = 0; x < self.width(); x++ ) {
      for( var y = 0; y < self.height(); y++ ) {
        var fieldX = self.x() + x;
        var fieldY = self.y() + y;
        if( fieldX < 0 || fieldX >= field.width() || fieldY < 0 || fieldY > field.height() )
          continue;
        var widgetBlock = self.grid().blocks()[x][y];
        if( widgetBlock > 0 )
          // TODO: shouldn't be modifying the field with code like this.
          // Extend the field with the capability to embed a block or 
          // remove this loop and add the ability to embed an entire grid to the field
          field.grid().blocks()[fieldX][fieldY] = widgetBlock;
      }
    }
  }

  self.collides = function() {
    for( var x = 0; x < self.width(); x++ ) {
      for( var y = 0; y < self.height(); y++ ) {
        var fieldX = self.x() + x;
        var fieldY = self.y() + y;
        var widgetBlock = self.grid().blocks()[x][y];
        if( widgetBlock == 0 )
          continue;
        var outOfBounds = fieldX < 0 || fieldX >= field.width() || fieldY >= field.height();
        if( outOfBounds )
          return true;
        if( fieldX < 0 || fieldX >= field.width() || fieldY < 0 || fieldY > field.height() )
          continue;
        var fieldBlock = field.grid().blocks()[fieldX][fieldY];
        if( fieldBlock > 0 )
          return true;
      }
    }
    return false;
  }

  self.update = function( elapsed ) {
    // apply field gravity
    self.y( self.y() + ( elapsed / 1000.0 ) * field.gravity() ); 
  }
}
