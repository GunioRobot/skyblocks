describe( 'dropper', function() {

  var field, figure, piece, dropper, controller, state, initialY, bottomY;
  beforeEach( function() {
    field = new SkyBlocks.field();
    figure = SkyBlocks.figures[ 0 ];
    bottomY = field.height - 2; // bottom y for the L figure
    piece = new SkyBlocks.piece( figure, field );
    dropper = new SkyBlocks.dropper();
    controller = new SkyBlocks.controller();
    state = { controller: controller, piece: piece }
    initialY = piece.y;
  });

  describe( 'when drop control is down', function() {

    beforeEach( function() {
      controller.sendDown( SkyBlocks.controls.drop );
    });

    it( 'drops the piece until it collides', function() {
      dropper.update( state );
      expect( piece.y ).toEqual( bottomY );
    });

    it( 'lands the piece', function() {
      state = dropper.update( state );
      expect( state.pieceLanded ).toBeTruthy();
    });
  });

  describe( 'when drop control is not down', function() {

    it( 'does not drop the piece', function() {
      dropper.update( state );
      expect( piece.y ).toEqual( initialY );
    });

  });

});
