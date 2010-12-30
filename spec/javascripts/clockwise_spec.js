describe( 'clockwise', function() {

  var clockwise, field, figure, piece, controller, state, lastOrientation;
  beforeEach( function() {
    clockwise = new SkyBlocks.clockwise();
    field = new SkyBlocks.field();
    figure = SkyBlocks.figures[ 0 ];
    piece = new SkyBlocks.piece( figure, field );
    piece.orientation = 1;
    controller = new SkyBlocks.controller();
    state = { piece: piece, controller: controller };
    lastOrientation = figure.orientations.length - 1;
  });

  describe( 'when clockwise control is down', function() {

    beforeEach( function() {
      controller.sendDown( SkyBlocks.controls.clockwise );
    });

    it( 'rotates clockwise if the clockwise controls is down', function() {
      clockwise.update( state );
      expect( piece.orientation ).toEqual( 0 );
    });

    it( 'rotates to the last orientation after going before 0', function() {
      piece.orientation = 0;
      clockwise.update( state );
      expect( piece.orientation ).toEqual( lastOrientation );
    });

    it( 'does not rotate clockwise if rotation would cause piece to collide', function() {
      spyOn( piece, 'collides' ).andReturn( true );
      clockwise.update( state );
      expect( piece.orientation ).toEqual( 1 );
    });

  });

  describe( 'when clockwise control is not down', function() {

    it( 'does not rotate if clockwise control is not down', function() {
      clockwise.update( state );
      expect( piece.orientation ).toEqual( 1 );
    });

  });

});
