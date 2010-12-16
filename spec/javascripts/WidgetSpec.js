describe( 'Widget', function() {
  var widget;
  beforeEach( function() {
    widget = new SkyBlocks.widget();
  });

  it( 'has a width and height', function() {
    expect( widget.width() ).not.toBeNull();
    expect( widget.height() ).not.toBeNull();
  });

  it( 'has a figure', function() {
    expect( widget.figure() ).not.toBeNull();
  });

  describe( 'grid', function() {
    it( 'is set to the first grid of the widget figure', function() {
      var widgetBlocks = widget.grid().blocks();
      var figureBlocks = widget.figure().grids()[0].blocks();
      for( var x = 0; x < widget.width(); x++ )
        for( var y = 0; y< widget.height(); y++ )
          expect( widgetBlocks[x][y] ).toEqual( figureBlocks[x][y] );
    });
  });

  describe( 'position', function() {
    it( 'is initially at 0, 0', function() {
      expect( widget.x() ).toEqual( 0 );
      expect( widget.y() ).toEqual( 0 );
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

    it( 'updates the grid to the figures next rotation grid', function() {
      widget.rotate( 1 );
      var widgetBlocks = widget.grid().blocks();
      var expectedBlocks = widget.figure().grids()[ widget.rotationIndex() ].blocks();
      for( var x = 0; x < widget.width(); x++ )
        for( var y = 0; y < widget.height(); y++ )
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

    it( 'updates the grid to the figures next rotation grid', function() {
      widget.rotate( -1 );
      var widgetBlocks = widget.grid().blocks();
      var expectedBlocks = widget.figure().grids()[ widget.rotationIndex() ].blocks();
      for( var x = 0; x < widget.width(); x++ )
        for( var y = 0; y< widget.height(); y++ )
          expect( widgetBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
    });
  });
});
