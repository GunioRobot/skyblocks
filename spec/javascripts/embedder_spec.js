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
    for( var x = 0; x < piece.figure.width; x++ ) {
      for( var y = 0; y < piece.figure.height; y++ ) {
        var fx = Math.floor( piece.x + x );
        var fy = Math.floor( piece.y + y );
        var fieldBlock = field.blocks[ fx ][ fy ];
        var pieceBlock = piece.figure.orientations[ piece.orientation ][ x ][ y ];
        expect( fieldBlock ).toEqual( pieceBlock );
      }
    }
  });
});
