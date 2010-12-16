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
});
