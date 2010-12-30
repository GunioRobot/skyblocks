describe( 'gravity', function() {

  var field, figure, piece, gravity, state, initialY, bottomY;
  beforeEach( function() {
    field = new SkyBlocks.field();
    figure = SkyBlocks.figures[ 0 ];
    bottomY = field.height - 2; // bottom y for the L figure
    piece = new SkyBlocks.piece( figure, field );
    gravity = new SkyBlocks.gravity( 2.5 );
    state = { elapsed: 3000, piece: piece }
    initialY = piece.y;
  });

  it( 'moves the piece down correctly over time', function() {
    gravity.update( state );
    expect( piece.y ).toEqual( initialY + 7.5 );
  });

  it( 'lands the piece once the piece collides', function() {
    state.elapsed = 20000; // 20 seconds will put the piece past the bottom of the field
    state = gravity.update( state );
    expect( piece.y ).toEqual( bottomY );
    expect( state.pieceLanded ).toBeTruthy();
  });
});
