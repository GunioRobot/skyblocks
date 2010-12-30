describe( 'piece', function() {

  var figure, field, piece, next, state, singleBlockFigure;
  beforeEach( function() {
    figure = SkyBlocks.figures[ 3 ]; // I figure
    field = new SkyBlocks.field();
    piece = new SkyBlocks.piece( figure, field );
    next = new SkyBlocks.next();
    state = { field: field, next: next, piece: piece }
    singleBlockFigure = new SkyBlocks.figure( 3, 3, [ 0x10 ] );
  });

  describe( 'position', function() {

    it( 'starts at the top center of the field', function() {
      expect( piece.x ).toEqual( Math.floor( ( field.width - figure.width ) / 2 ) );
      expect( piece.y ).toEqual( 0 );
    });
  });

  describe( 'orientation', function() {

    it( 'is initially 0', function() {
      expect( piece.orientation ).toEqual( 0 );
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

  describe( 'update', function() {

    describe( 'when piece has not landed', function() {

      var initialX, initialY;
      beforeEach( function() {
        initialX = piece.x;
        initialY = piece.y;
        state.pieceLanded = false;
        piece.update( state );
      });

      it( 'should not change the piece', function() {
        expect( piece.x ).toEqual( initialX );
        expect( piece.y ).toEqual( initialY );
        expect( piece.orientation ).toEqual( 0 );
        expect( piece.figure ).toEqual( figure );
      });
    });

    describe( 'when piece landed', function() {

      beforeEach( function() {
        // move and rotate the piece somewhere so we can make sure it gets moved back
        piece.x = 5;
        piece.y = 10;
        piece.orientation = 1;
        state.pieceLanded = true;
        piece.update( state );
      });

      it( 'should change the piece figure to the next figure', function() {
        expect( piece.figure ).toEqual( next.figure );
      });

      it( 'should move the piece back to the top center of the field', function() {
        expect( piece.x ).toEqual( Math.floor( ( field.width - figure.width ) / 2 ) );
        expect( piece.y ).toEqual( 0 );
      });

      it( 'should set the orientation to 0', function() {
        expect( piece.orientation ).toEqual( 0 );
      });
    });
  });
});
