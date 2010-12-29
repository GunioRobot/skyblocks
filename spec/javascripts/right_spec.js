describe( 'right', function() {

  var right, field, piece, controller, state, intialX;
  beforeEach( function() {
    right = new SkyBlocks.right();
    field = new SkyBlocks.field();
    piece = new SkyBlocks.piece( SkyBlocks.figures[ 0 ], field );
    controller = new SkyBlocks.controller();
    state = { piece: piece, controller: controller }
    initialX = piece.x;
  });

  describe( 'when right control is down', function() {

    beforeEach( function() {
      controller.sendDown( SkyBlocks.controls.right );
    });

    it( 'moves right if the right controls is down', function() {
      right.update( state );
      expect( piece.x ).toEqual( initialX + 1 );
    });

    it( 'does not move right if movement would cause piece to collide', function() {
      spyOn( piece, 'collides' ).andReturn( true );
      right.update( state );
      expect( piece.x ).toEqual( initialX );
    });

  });

  describe( 'when right control is not down', function() {

    it( 'does not move if right control is not down', function() {
      right.update( state );
      expect( piece.x ).toEqual( initialX );
    });

  });

});
