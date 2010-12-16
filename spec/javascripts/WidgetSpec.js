describe( 'Widget', function() {
  var figure, field, widget;
  beforeEach( function() {
    figure = SkyBlocks.figure.random();
    field = new SkyBlocks.field();
    widget = new SkyBlocks.widget( figure, field );
  });

  it( 'figure and field are set', function() {
    expect( widget.figure() ).toBe( figure );
    expect( widget.field() ).toBe( field );
  });

  describe( 'width', function() {
    it( 'is equal to the figure width', function() {
      expect( widget.width() ).toEqual( widget.figure().width() );
    });
  });

  describe( 'height', function() {
    it( 'is equal to the figure height', function() {
      expect( widget.height() ).toEqual( widget.figure().height() );
    });
  });

  describe( 'grid', function() {
    it( 'is set to the first grid of the widgets figure', function() {
      var widgetBlocks = widget.grid().blocks();
      var figureBlocks = widget.figure().grids()[0].blocks();
      for( var x = 0; x < widget.width(); x++ )
        for( var y = 0; y< widget.figure().height(); y++ )
          expect( widgetBlocks[x][y] ).toEqual( figureBlocks[x][y] );
    });
  });

  describe( 'position', function() {
    it( 'is starts at the top center of the field', function() {
      var x = Math.floor( ( field.width() - widget.width() ) / 2 );
      var y = -widget.height();
      expect( widget.x() ).toEqual( x );
      expect( widget.y() ).toEqual( y );
    });
  });

  describe( 'setting the position', function() {
    beforeEach( function() {
      widget.x( 5 );
      widget.y( 7 );
    });

    it( 'updates the x and y coordinates', function() {
      expect( widget.x() ).toEqual( 5 );
      expect( widget.y() ).toEqual( 7 );
    });
  });

  describe( 'counter clockwise rotation', function() {
    it( 'updates the rotation index', function() {
      var current = widget.rotationIndex();
      var expected = current + 1;
      if( expected >= widget.figure().transforms().length )
        expected = 0;
      widget.rotate( 1 );
      expect( widget.rotationIndex() ).toEqual( expected );
    });

    it( 'restarts when passing last rotation', function() {
      var initial = widget.rotationIndex(); 
      for( var i = 0; i < widget.figure().transforms().length; i++ )
        widget.rotate( 1 );
      expect( widget.rotationIndex() ).toEqual( initial );
    });

    it( 'updates the grid to the figures next transform grid', function() {
      widget.rotate( 1 );
      var widgetBlocks = widget.grid().blocks();
      var expectedBlocks = widget.figure().grids()[ widget.rotationIndex() ].blocks();
      for( var x = 0; x < widget.width(); x++ )
        for( var y = 0; y < widget.figure().height(); y++ )
          expect( widgetBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
    });
  });

  describe( 'clockwise rotation', function() {
    it( 'updates the rotation index', function() {
      var current = widget.rotationIndex();
      var expected = current - 1;
      if( expected < 0 )
        expected = widget.figure().transforms().length - 1;
      widget.rotate( -1 );
      expect( widget.rotationIndex() ).toEqual( expected );
    });

    it( 'restarts when passing last rotation', function() {
      var initial = widget.rotationIndex(); 
      for( var i = 0; i < widget.figure().transforms().length; i++ )
        widget.rotate( -1 );
      expect( widget.rotationIndex() ).toEqual( initial );
    });

    it( 'updates the grid to the figures next transform grid', function() {
      widget.rotate( -1 );
      var widgetBlocks = widget.grid().blocks();
      var expectedBlocks = widget.figure().grids()[ widget.rotationIndex() ].blocks();
      for( var x = 0; x < widget.width(); x++ )
        for( var y = 0; y< widget.figure().height(); y++ )
          expect( widgetBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
    });
  });

  describe( 'effect of field gravity on widget', function() {
    beforeEach( function() {
      field.gravity( 2.5 ); // 2.5 blocks per second
    });

    it( 'drops the widget down correctly over time', function() {
      var initialX = widget.x();
      var initialY = widget.y();
      widget.update( 3000 ); // advance 3 seconds
      expect( widget.x() ).toEqual( initialX );
      expect( widget.y() ).toEqual( initialY + 7.5 );
    });
  });

  describe( 'embed', function() {
    beforeEach( function() {
      widget.x( 4 );
      widget.y( 5 );
      widget.embed();
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
  });
});
