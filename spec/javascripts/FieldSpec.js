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

  describe( 'active shape', function() {
    it( 'is initially null', function() {
      expect( field.activeShape() ).toBeNull();
    });
  });

  describe( 'setting the active shape', function() {
    var shape;
    beforeEach( function() {
      shape = new SkyBlocks.shape();
      field.activeShape( shape );
    });

    it( 'updates the active shape', function() {
      expect( field.activeShape() ).toBe( shape );
    });

    it( 'moves the shape at the top center of the field', function() {
      var x = Math.floor( ( field.width() - shape.width() ) / 2 );
      var y = -shape.height();
      expect( shape.x() ).toEqual( x );
      expect( shape.y() ).toEqual( y );
    });
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

  describe( 'effect of gravity on active shape', function() {
    beforeEach( function() {
      shape = new SkyBlocks.shape();
      field.activeShape( shape );
      field.gravity( 2.5 ); // 2.5 blocks per second
    });

    it( 'drops the shape down correctly over time', function() {
      var initialX = shape.x();
      var initialY = shape.y();
      field.update( 3000 ); // advance 3 seconds
      expect( shape.x() ).toEqual( initialX );
      expect( shape.y() ).toEqual( initialY + 7.5 );
    });
  });

  describe( 'embed', function() {
    beforeEach( function() {
      shape = new SkyBlocks.shape();
      field.activeShape( shape );
      shape.x( 4 );
      shape.y( 5 );
      field.embed();
    });

    it( 'copies the active shape blocks into the field blocks', function() {
      for( var x = 0; x < shape.width(); x++ ) {
        for( var y = 0; y < shape.height(); y++ ) {
          var fieldX = shape.x() + x;
          var fieldY = shape.y() + y;
          if( fieldX < 0 || fieldX >= field.width() || fieldY < 0 || fieldY > field.height() )
            continue;
          var fieldBlock = field.grid().blocks()[fieldX][fieldY];
          var shapeBlock = shape.grid().blocks()[x][y];
          expect( fieldBlock ).toEqual( shapeBlock );
        }
      }
    });

    it( 'nulls out the active shape', function() {
      expect( field.activeShape() ).toBeNull();
    });
  });
});
