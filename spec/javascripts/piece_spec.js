describe( 'piece', function() {

  var figure, field, piece, singleBlockFigure;
  beforeEach( function() {
    figure = SkyBlocks.figures[3]; // I figure
    field = new SkyBlocks.field();
    piece = new SkyBlocks.piece( figure, field );
    singleBlockFigure = new SkyBlocks.figure( 3, 3, [0x10] );
  });

  describe( 'blocks', function() {

    it( 'has the same blocks as the figures first orientation', function() {
      var orientation = figure.orientations[ 0 ];
      for( var x = 0; x < figure.width; x++ )
        for( var y = 0; y< figure.height; y++ )
          expect( piece.blocks[ x ][ y ] ).toEqual( orientation[ x ][ y ] );
    });
  });

  describe( 'position', function() {

    it( 'starts at the top center of the field', function() {
      expect( piece.x ).toEqual( Math.floor( ( field.width - figure.width ) / 2 ) );
      expect( piece.y ).toEqual( 0 );
    });
  });
  
  describe( 'collision', function() {

    beforeEach( function() {
      piece = new SkyBlocks.piece( singleBlockFigure, field );
      piece.y = 5;
    });

    it( 'does not initally collide', function() {
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'does not collide if out of bounds to the left of the field but all blocks are in bounds', function() {
      piece.x = -1;
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds to the left of the field', function() {
      piece.x = -2;
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'does not collide if out of bounds to the right of the field but all blocks are in bounds', function() {
      piece.x = field.width - 2;
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds to the right of the field', function() {
      piece.x = field.width - 1;
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'does not collide if out of bounds to the top of the field but all blocks are in bounds', function() {
      piece.y = -1;
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds on the top of the field', function() {
      piece.y = -3;
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'does not collide if out if below the bottom of the field but blocks are in bounds', function() {
      piece.y = field.height - 2;
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are below the bottom of the field', function() {
      piece.y = field.height - 1;
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'collides if overlaps any other blocks embedded in the field', function() {
      piece.x = 4;
      piece.y = 1;
      field.blocks[ 5 ][ 2 ] = 1;
      expect( piece.collides() ).toBeTruthy();
    });

  });
});
