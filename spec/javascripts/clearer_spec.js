describe( 'clearer', function() {

  var field, fullLine, partialLine, clearer, state;

  beforeEach( function() {
    field = new SkyBlocks.field();

    // create a field with two full lines filled in and some 
    // partially filled lines in between so we can test clearing
    fullLine = [];
    for( var i = 0; i < field.width; i++ )
      fullLine.push( i );

    partialLine = [];
    for( var i = 0; i < field.width; i += 2 )
      partialLine.push( i );

    field.lines[ field.lines.length - 1 ] = fullLine.slice( 0 );
    field.lines[ field.lines.length - 2 ] = fullLine.slice( 0 );
    field.lines[ field.lines.length - 3 ] = partialLine.slice( 0 );
    field.lines[ field.lines.length - 4 ] = fullLine.slice( 0 );
    field.lines[ field.lines.length - 5 ] = partialLine.slice( 0 );

    clearer = new SkyBlocks.clearer();
    state = { field: field };
  });

  describe( 'update', function() {

    describe( 'when piece did not land', function() {

      beforeEach( function() {
        state.pieceLanded = false;
        clearer.update( state );
      });

      it( 'should not clear any lines', function() {
        expect( field.lines[ field.lines.length - 1 ] ).toEqual( fullLine );
        expect( field.lines[ field.lines.length - 2 ] ).toEqual( fullLine );
        expect( field.lines[ field.lines.length - 3 ] ).toEqual( partialLine );
        expect( field.lines[ field.lines.length - 4 ] ).toEqual( fullLine );
        expect( field.lines[ field.lines.length - 5 ] ).toEqual( partialLine );
      });

      it( 'set the state number of lines cleared', function() {
        expect( state.linesCleared ).toEqual( 0 );
      });

    });

    describe( 'when piece landed', function() {

      beforeEach( function() {
        state.pieceLanded = true;
        clearer.update( state );
      });

      it( 'should properly clear the lines', function() {
        expect( field.lines[ field.lines.length - 1 ] ).toEqual( partialLine );
        expect( field.lines[ field.lines.length - 2 ] ).toEqual( partialLine );
        expect( field.lines[ field.lines.length - 3 ] ).toEqual( [] );
        expect( field.lines[ field.lines.length - 4 ] ).toEqual( [] );
      });

      it( 'set the state number of lines cleared', function() {
        expect( state.linesCleared ).toEqual( 3 );
      });

    });
  });
});
