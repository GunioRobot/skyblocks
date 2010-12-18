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
    var linesBefore = [
      [0,1,1,1],
      [1,1,0,1],
      [1,1,1,1],
      [1,1,0,1],
      [1,1,0,1],
      [1,1,1,1],
      [1,1,1,1],
      [0,1,0,1],
      [1,1,1,1],
      [1,1,0,1]
    ];
    var linesAfter = [
      [0,0,0,1],
      [0,0,1,0],
      [0,0,1,1],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,1],
      [0,0,1,1],
      [0,0,0,0],
      [0,0,1,1],
      [0,0,1,0]
    ];
    var linesCleared;
    beforeEach( function() {
      // setup some lines
      for( var x = 0; x < field.width(); x++ ) {
        for( var y = 0; y < 4; y++ ) {
          var fieldY = field.height() - y - 1;
          field.grid().blocks()[x][fieldY] = linesBefore[x][3 - y];
        }
      }
      linesCleared = field.clearLines();
    });

    it( 'clears out completed lines', function() {
      for( var y = 0; y < 4; y++ ) {
        for( var x = 0; x < field.width(); x++ ) {
          var fieldY = field.height() - y - 1;
          var fieldBlock = field.grid().blocks()[x][fieldY];
          var expectedBlock = linesAfter[x][3 - y];
          expect( fieldBlock ).toEqual( expectedBlock );
        }
      }
    });

    it( 'returns the number of lines cleared', function() {
      expect( linesCleared ).toEqual( 2 );
    });
  });
});
