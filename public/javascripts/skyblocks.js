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
  self.attr( 'activeShape', null );

  self._activeShapeChanged = function() {
    if( self.activeShape() == null ) return;
    // position the shape at the top center of the field
    self.activeShape().x( Math.floor( ( self.width() - self.activeShape().width() ) / 2 ) );
    self.activeShape().y( -self.activeShape().height() ); 
  }

  self.embed = function() {
    for( var x = 0; x < shape.width(); x++ ) {
      for( var y = 0; y < shape.height(); y++ ) {
        var fieldX = shape.x() + x;
        var fieldY = shape.y() + y;
        if( fieldX < 0 || fieldX >= self.width() || fieldY < 0 || fieldY > self.height() )
          continue;
        var shapeBlock = shape.grid().blocks()[x][y];
        self.grid().blocks()[fieldX][fieldY] = shapeBlock;
      }
    }
    self.activeShape( null );
  }

  self.update = function( elapsed ) {
    // apply gravity to the active shape
    shape.y( shape.y() + ( elapsed / 1000.0 ) * self.gravity() ); 
  }
}

/* 
 * SkyBlocks.pattern
 * helper class to define a pattern for shapes
 */
SkyBlocks.pattern = function( width, height, transforms ) {
  var self = this;

  self.attr( 'value', SkyBlocks.patterns.length + 1 );
  self.attr( 'width', width );
  self.attr( 'height', height );
  self.attr( 'transforms', transforms );
  self.attr( 'grids', [] );

  // convert the hex transforms into actual grids
  for( var i = 0; i < self.transforms().length; i++ ) {
    var grid = new SkyBlocks.grid( self.width(), self.height(), self.value(), self.transforms()[i] );
    self.grids()[i] = grid;
  }

  SkyBlocks.patterns.push( self );
}

/* 
 * define all the standard patterns
 * l, j, t, i, s, z, o
 */
SkyBlocks.patterns = [];
SkyBlocks.lPattern = new SkyBlocks.pattern( 3, 3, [ 0x3C, 0x192, 0x78, 0x93 ] );
SkyBlocks.jPattern = new SkyBlocks.pattern( 3, 3, [ 0x138, 0xD2, 0x39, 0x96 ] ); 
SkyBlocks.tPattern = new SkyBlocks.pattern( 3, 3, [ 0xB8, 0x9A, 0x3A, 0xB2 ] );
SkyBlocks.iPattern = new SkyBlocks.pattern( 4, 4, [ 0xF00, 0x4444 ] ); 
SkyBlocks.sPattern = new SkyBlocks.pattern( 3, 3, [ 0x1E, 0x99 ] );
SkyBlocks.zPattern = new SkyBlocks.pattern( 3, 3, [ 0x33, 0x5A ] );
SkyBlocks.oPattern = new SkyBlocks.pattern( 2, 2, [ 0xF ] );

SkyBlocks.randomPattern = function() {
  return SkyBlocks.patterns[ Math.floor( Math.random() * SkyBlocks.patterns.length ) ];
}

/* 
 * SkyBlocks.shape
 * Represents a shape that can be controlled in the field
 */
SkyBlocks.shape = function() {
  var self = this;

  self.attr( 'x', 0 );
  self.attr( 'y', 0 );
  self.attr( 'pattern', SkyBlocks.randomPattern() );
  self.attr( 'width', self.pattern().width() );
  self.attr( 'height', self.pattern().height() );
  self.attr( 'rotationIndex', 0 );

  self.grid = function() { 
    return self.pattern().grids()[ self.rotationIndex() ]; 
  }

  self.rotate = function( direction ) {
    self.rotationIndex( self.rotationIndex() + direction );
    if( self.rotationIndex() == self.pattern().grids().length )
      self.rotationIndex( 0 );
    else if( self.rotationIndex() < 0 )
      self.rotationIndex( self.pattern().grids().length - 1 );
  }
}
