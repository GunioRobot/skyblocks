describe( 'Field', function() {
  var field;
  beforeEach( function() {
    field = new SkyBlocks.field();
  });

  it( 'is 10 x 16', function() {
    expect( field.width() ).toEqual( 10 );
    expect( field.height() ).toEqual( 16 );
  });

  it( 'is initially empty', function() {
    for( var x = 0; x < field.width(); x++ )
      for( var y = 0; y < field.height(); y++ )
        expect( field.grid().blocks()[x][y] ).toEqual( 0 );
  });

  describe( 'gravity', function() {
    it( 'is initally 0 blocks per second', function() {
      expect( field.gravity() ).toEqual( 0.0 );
    });
  });

  describe( 'setting the gravity', function() {
    it( 'updates the gravity', function() {
      field.gravity( 2.5 ); // 2.5 blocks per second
      expect( field.gravity() ).toEqual( 2.5 );
    });
  });

  describe( 'clearing lines', function() {
    var linesCleared;
    beforeEach( function() {
      // setup some completed lines with incomplete lines in between
      for( var x = 0; x < field.width(); x++ ) {
        field.grid().blocks()[x][field.height() - 1] = 1;
        field.grid().blocks()[x][field.height() - 2] = x % 2;
        field.grid().blocks()[x][field.height() - 3] = 1;
        field.grid().blocks()[x][field.height() - 4] = x % 2;
      }
      linesCleared = field.clearLines();
    });

    it( 'clears out completed lines and drops down remaining lines', function() {
      for( var x = 0; x < field.width(); x++ ) {
        expect( field.grid().blocks()[x][field.height() - 1] ).toEqual( x % 2 );
        expect( field.grid().blocks()[x][field.height() - 2] ).toEqual( x % 2 );
        expect( field.grid().blocks()[x][field.height() - 3] ).toEqual( 0 );
        expect( field.grid().blocks()[x][field.height() - 4] ).toEqual( 0 );
      }
    });

    it( 'returns the number of lines cleared', function() {
      expect( linesCleared ).toEqual( 2 );
    });
  });
});
