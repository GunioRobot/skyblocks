describe( 'counterClockwise', function() {

  var counterClockwise, field, figure, piece, controller, state;
  beforeEach( function() {
    counterClockwise = new SkyBlocks.counterClockwise();
    field = new SkyBlocks.field();
    figure = SkyBlocks.figures[ 0 ];
    piece = new SkyBlocks.piece( figure, field );
    controller = new SkyBlocks.controller();
    state = { piece: piece, controller: controller };
  });

  describe( 'when counter clockwise control is down', function() {

    beforeEach( function() {
      controller.sendDown( SkyBlocks.controls.counterClockwise );
    });

    it( 'rotates counter clockwise if the counter clockwise controls is down', function() {
      counterClockwise.update( state );
      expect( piece.orientation ).toEqual( 1 );
    });

    it( 'rotates back to orientation 0 after going past last orientation', function() {
      piece.orientation = piece.figure.orientations.length - 1;
      counterClockwise.update( state );
      expect( piece.orientation ).toEqual( 0 );
    });

    it( 'does not rotate counter clockwise if rotation would cause piece to collide', function() {
      spyOn( piece, 'collides' ).andReturn( true );
      counterClockwise.update( state );
      expect( piece.orientation ).toEqual( 0 );
    });

  });

  describe( 'when counter clockwise control is not down', function() {

    it( 'does not rotate if counter clockwise control is not down', function() {
      counterClockwise.update( state );
      expect( piece.orientation ).toEqual( 0 );
    });

  });

});
