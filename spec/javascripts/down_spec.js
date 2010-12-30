describe( 'down', function() {

  var down, field, piece, controller, state, intialY;
  beforeEach( function() {
    down = new SkyBlocks.down();
    field = new SkyBlocks.field();
    piece = new SkyBlocks.piece( SkyBlocks.figures[ 0 ], field );
    controller = new SkyBlocks.controller();
    state = { piece: piece, controller: controller }
    initialY = piece.y;
  });

  describe( 'when down control is down', function() {

    beforeEach( function() {
      controller.sendDown( SkyBlocks.controls.down );
    });

    it( 'moves down by 1 block', function() {
      down.update( state );
      expect( piece.y ).toEqual( initialY + 1 );
    });

    it( 'does not move down if movement would cause piece to collide', function() {
      spyOn( piece, 'collides' ).andReturn( true );
      down.update( state );
      expect( piece.y ).toEqual( initialY );
    });

  });

  describe( 'when down control is not down', function() {

    it( 'does not move the piece', function() {
      down.update( state );
      expect( piece.y ).toEqual( initialY );
    });

  });

});
