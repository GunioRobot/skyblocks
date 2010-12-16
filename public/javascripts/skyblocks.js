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
 * helper class to create a grid of blocks
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
 * two dimensional grid representing the main game area
 */
SkyBlocks.field = function() {
  var self = this;

  self.attr( 'width', 10 );
  self.attr( 'height', 16 );
  self.attr( 'grid', new SkyBlocks.grid( self.width(), self.height(), 0x0 ) );
  self.attr( 'gravity', 0.0 );
  self.attr( 'widget', null );

  self._widgetChanged = function() {
    if( self.widget() == null ) return;
    // position the widget at the top center of the field
    self.widget().x( Math.floor( ( self.width() - self.widget().width() ) / 2 ) );
    self.widget().y( -self.widget().height() ); 
  }

  self.embed = function() {
    for( var x = 0; x < widget.width(); x++ ) {
      for( var y = 0; y < widget.height(); y++ ) {
        var fieldX = widget.x() + x;
        var fieldY = widget.y() + y;
        if( fieldX < 0 || fieldX >= self.width() || fieldY < 0 || fieldY > self.height() )
          continue;
        var widgetBlock = widget.grid().blocks()[x][y];
        self.grid().blocks()[fieldX][fieldY] = widgetBlock;
      }
    }
    self.widget( null );
  }

  self.update = function( elapsed ) {
    // apply gravity to the active widget
    widget.y( widget.y() + ( elapsed / 1000.0 ) * self.gravity() ); 
  }
}

/* 
 * SkyBlocks.figure
 * helper class to define a figure for widgets
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

SkyBlocks.randomFigure = function() {
  return SkyBlocks.figures[ Math.floor( Math.random() * SkyBlocks.figures.length ) ];
}

/* 
 * SkyBlocks.widget
 * Represents a widget that can be controlled in the field
 */
SkyBlocks.widget = function() {
  var self = this;

  self.attr( 'x', 0 );
  self.attr( 'y', 0 );
  self.attr( 'figure', SkyBlocks.randomFigure() );
  self.attr( 'width', self.figure().width() );
  self.attr( 'height', self.figure().height() );
  self.attr( 'rotationIndex', 0 );

  self.grid = function() { 
    return self.figure().grids()[ self.rotationIndex() ]; 
  }

  self.rotate = function( direction ) {
    self.rotationIndex( self.rotationIndex() + direction );
    if( self.rotationIndex() == self.figure().grids().length )
      self.rotationIndex( 0 );
    else if( self.rotationIndex() < 0 )
      self.rotationIndex( self.figure().grids().length - 1 );
  }
}
