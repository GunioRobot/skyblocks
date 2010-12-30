describe( 'clearer', function() {

  var field, blocks, clearedBlocks, clearer, state;

  beforeEach( function() {
    field = new SkyBlocks.field();
    blocks = [];
    clearedBlocks = [];

    // create a field with two full lines filled in and some 
    // partially filled lines in between so we can test clearing
    for( var x = 0; x < field.width; x++ ) {
      blocks[ x ] = [];
      clearedBlocks[ x ] = [];

      for( var y = 0; y < field.height; y++ ) {
        var isFullLine = y == field.height - 1 || y == field.height - 3;
        var isPartialLine = y == field.height - 2 || y == field.height - 4;
        var isClearPartialLine = y == field.height - 1 || y == field.height - 2;
        var isEvenBlock = x % 2 == 0;

        blocks[ x ][ y ] = isFullLine || ( isPartialLine && isEvenBlock ) ? 1 : 0;
        field.blocks[ x ][ y ] = isFullLine || ( isPartialLine && isEvenBlock ) ? 1 : 0;
        clearedBlocks[ x ][ y ] = isClearPartialLine && isEvenBlock ? 1 : 0; 
      }
    }

    clearer = new SkyBlocks.clearer();
    state = { field: field };
  });

  describe( 'update', function() {

    describe( 'when piece did not land', function() {

      beforeEach( function() {
        state.pieceLanded = false;
        state = clearer.update( state );
      });

      it( 'should not clear any lines', function() {
        for( var x = 0; x < field.width; x++ )
          for( var y = 0; y < field.height; y++ )
            expect( field.blocks[ x ][ y ] ).toEqual( blocks[ x ][ y ] );
      });

      it( 'should return 0 for number of lines cleared', function() {
        expect( state.linesCleared ).toEqual( 0 );
      });

    });

    describe( 'when piece landed', function() {

      beforeEach( function() {
        state.pieceLanded = true;
        state = clearer.update( state );
      });

      it( 'should properly clear the lines', function() {
        for( var x = 0; x < field.width; x++ )
          for( var y = 0; y < field.height; y++ )
            expect( field.blocks[ x ][ y ] ).toEqual( clearedBlocks[ x ][ y ] );
      });

      it( 'should return the number of lines cleared', function() {
        expect( state.linesCleared ).toEqual( 2 );
      });

    });
  });
});
