describe( 'embedder', function() {

  var embedder, field, figure, piece, state;
  beforeEach( function() {
    embedder = new SkyBlocks.embedder();
    field = new SkyBlocks.field();
    figure = SkyBlocks.figures[ 0 ];
    piece = new SkyBlocks.piece( figure, field );
    state = { field: field, piece: piece };
  });

  it( 'should do nothing if piece not landed', function() {
    state.pieceLanded = false;
    embedder.update( state );
    expect( field.blocks ).toEqual( field.blocks );
  });

  it( 'should embed the piece into the field if piece is landed', function() {
    state.pieceLanded = true;
    embedder.update( state );
    for( var y = 0; y < figure.size; y++ ) {
      for( var x = 0; x < piece.figure.orientations[ piece.orientation ][ y ].length; x++ ) {
        var fx = Math.floor( piece.x + piece.figure.orientations[ piece.orientation ][ y ][ x ] );
        var fy = Math.floor( piece.y + y );
        expect( field.lines[ fy ].indexOf( fx ) ).toBeGreaterThan( -1 );
      }
    }
  });
});
