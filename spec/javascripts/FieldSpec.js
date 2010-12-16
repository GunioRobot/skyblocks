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

  describe( 'widget', function() {
    it( 'is initially null', function() {
      expect( field.widget() ).toBeNull();
    });
  });

  describe( 'setting the widget', function() {
    var widget;
    beforeEach( function() {
      widget = new SkyBlocks.widget();
      field.widget( widget );
    });

    it( 'updates the widget', function() {
      expect( field.widget() ).toBe( widget );
    });

    it( 'moves the widget at the top center of the field', function() {
      var x = Math.floor( ( field.width() - widget.width() ) / 2 );
      var y = -widget.height();
      expect( widget.x() ).toEqual( x );
      expect( widget.y() ).toEqual( y );
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

  describe( 'effect of gravity on widget', function() {
    beforeEach( function() {
      widget = new SkyBlocks.widget();
      field.widget( widget );
      field.gravity( 2.5 ); // 2.5 blocks per second
    });

    it( 'drops the widget down correctly over time', function() {
      var initialX = widget.x();
      var initialY = widget.y();
      field.update( 3000 ); // advance 3 seconds
      expect( widget.x() ).toEqual( initialX );
      expect( widget.y() ).toEqual( initialY + 7.5 );
    });
  });

  describe( 'embed', function() {
    beforeEach( function() {
      widget = new SkyBlocks.widget();
      field.widget( widget );
      widget.x( 4 );
      widget.y( 5 );
      field.embed();
    });

    it( 'copies the widget blocks into the field blocks', function() {
      for( var x = 0; x < widget.width(); x++ ) {
        for( var y = 0; y < widget.height(); y++ ) {
          var fieldX = widget.x() + x;
          var fieldY = widget.y() + y;
          if( fieldX < 0 || fieldX >= field.width() || fieldY < 0 || fieldY > field.height() )
            continue;
          var fieldBlock = field.grid().blocks()[fieldX][fieldY];
          var widgetBlock = widget.grid().blocks()[x][y];
          expect( fieldBlock ).toEqual( widgetBlock );
        }
      }
    });

    it( 'nulls out the widget', function() {
      expect( field.widget() ).toBeNull();
    });
  });
});
