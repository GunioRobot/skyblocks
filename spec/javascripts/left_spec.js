describe( 'left', function() {

  var left, field, piece, controller, state, intialX;
  beforeEach( function() {
    left = new SkyBlocks.left();
    field = new SkyBlocks.field();
    piece = new SkyBlocks.piece( SkyBlocks.figures[ 0 ], field );
    controller = new SkyBlocks.controller();
    state = { piece: piece, controller: controller }
    initialX = piece.x;
  });

  describe( 'when left control is down', function() {

    beforeEach( function() {
      controller.sendDown( SkyBlocks.controls.left );
    });

    it( 'moves left if the left controls is down', function() {
      left.update( state );
      expect( piece.x ).toEqual( initialX - 1 );
    });

    it( 'does not move left if movement would cause piece to collide', function() {
      spyOn( piece, 'collides' ).andReturn( true );
      left.update( state );
      expect( piece.x ).toEqual( initialX );
    });

  });

  describe( 'when left control is not down', function() {

    it( 'does not move if left control is not down', function() {
      left.update( state );
      expect( piece.x ).toEqual( initialX );
    });

  });

});
