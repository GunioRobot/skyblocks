/*
 * SkyBlocks
 * A browser based tetris clone
 *
 * Written by Lee Muro
 * https://github.com/leemuro/skyblocks
 */

var SkyBlocks = {};

Object.prototype.attr = function(name, initialValue) {
  this['_' + name] = initialValue;
  this[name] = function(val) { 
    if(typeof val == 'undefined')
      return this['_' + name];
    this['_' + name] = val;
    var changedCallback = this['_' + name + 'Changed'];
    if(changedCallback)
      changedCallback();
  }
}

/*
 * SkyBlocks.field
 * two dimensional matrix representing the main game area
 */
SkyBlocks.field = function() {
  var self = this;

  self.attr( 'width', 10 );
  self.attr( 'height', 16 );
  self.attr( 'gravity', 0.0 );
  self.attr( 'activeShape', null );

  self._activeShapeChanged = function() {
    // position the shape at the top center of the field
    self.activeShape().x( Math.floor( ( self.width() - self.activeShape().width() ) / 2 ) );
    self.activeShape().y( -self.activeShape().height() ); 
  }

  self.block = function( x, y ) { 
    return null; 
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
  self.attr( 'matrices', [] );

  // convert the hex transforms into actual matrices
  for( var i = 0; i < self.transforms().length; i++ ) {
    var matrix = new Array( self.width() );
    var n = 0, size = ( self.width() * self.height() );
    for( var y = 0; y < self.height(); y++ ) {
      for( var x = 0; x < self.width(); x++ ) {
        if( !matrix[x] ) matrix[x] = new Array( self.height() );
        var f = Math.pow( 2, size - 1 - n );
        matrix[x][y] = ( ( self.transforms()[i] & f ) / f ) > 0 ? self.value() : 0;
        n++;
      }
    }
    self.matrices()[i] = matrix;
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

  self.attr( 'width', 0 );
  self.attr( 'height', 0 );
  self.attr( 'x', 0 );
  self.attr( 'y', 0 );
  self.attr( 'pattern', SkyBlocks.randomPattern() );
  self.attr( 'rotationIndex', 0 );

  self.matrix = function() { 
    return self.pattern().matrices[ self.rotationIndex() ]; 
  }

  self.rotate = function( direction ) {
    self.rotationIndex( self.rotationIndex() + direction );
    if( self.rotationIndex() == self.pattern().matrices().length )
      self.rotationIndex( 0 );
    else if( self.rotationIndex() < 0 )
      self.rotationIndex( self.pattern().matrices().length - 1 );
  }
}
