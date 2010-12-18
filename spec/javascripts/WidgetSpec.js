describe( 'Widget', function() {
  var figure, field, widget, singleBlockFigure;
  beforeEach( function() {
    figure = SkyBlocks.iFigure;
    field = new SkyBlocks.field();
    widget = new SkyBlocks.widget( figure, field );
    singleBlockFigure = new SkyBlocks.figure( 3, 3, [0x10] );
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

    it( 'does not embed empty space over already embedded blocks', function() {
      // embed two single block widgets, on offset by one block
      var widget1 = new SkyBlocks.widget( singleBlockFigure, field );
      var widget2 = new SkyBlocks.widget( singleBlockFigure, field );
      widget1.x( 0 );
      widget1.y( 0 );
      widget1.embed();
      widget2.x( 1 );
      widget2.y( 1 );
      widget2.embed();
      // make sure both blocks are in the field afterwads
      var block1 = field.grid().blocks()[1][1];
      var block2 = field.grid().blocks()[2][2];
      expect( block1 ).not.toEqual( 0 );
      expect( block2 ).not.toEqual( 0 );
    });
  });

  describe( 'collision', function() {
    beforeEach( function() {
      widget = new SkyBlocks.widget( singleBlockFigure, field );
      widget.y( 5 );
    });

    it( 'does not initally collide', function() {
      expect( widget.collides() ).toBeFalsy();
    });

    it( 'does not collide if out of bounds to the left of the field but all blocks are in bounds', function() {
      widget.x( -1 );
      expect( widget.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds to the left of the field', function() {
      widget.x( -2 );
      expect( widget.collides() ).toBeTruthy();
    });

    it( 'does not collide if out of bounds to the right of the field but all blocks are in bounds', function() {
      widget.x( field.width() - 2 );
      expect( widget.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds to the right of the field', function() {
      widget.x( field.width() - 1 );
      expect( widget.collides() ).toBeTruthy();
    });

    it( 'does not collide if blocks are out of bounds on the top of the field', function() {
      widget.y( -2 );
      expect( widget.collides() ).toBeFalsy();
    });

    it( 'does not collide if out if below the bottom of the field but blocks are in bounds', function() {
      widget.y( field.height() - 2 );
      expect( widget.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are below the bottom of the field', function() {
      widget.y( field.height() - 1 );
      expect( widget.collides() ).toBeTruthy();
    });

    it( 'collides if overlaps any other blocks embedded in the field', function() {
      var embedWidget = new SkyBlocks.widget( singleBlockFigure, field );
      embedWidget.x( 2 );
      embedWidget.y( 5 );
      embedWidget.embed();
      widget.x( 2 );
      widget.y( 5 );
      expect( widget.collides() ).toBeTruthy();
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

    it( 'does not rotate if rotation would cause collision', function() {
      // Embed an i widget into the top left corner of the field
      var iWidget = new SkyBlocks.widget( SkyBlocks.iFigure, field ); 
      iWidget.x( 0 );
      iWidget.y( 0 );
      iWidget.embed();
      // Take another i widget in slightly offset and try to rotate it
      var iWidget = new SkyBlocks.widget( SkyBlocks.iFigure, field ); 
      iWidget.x( 1 );
      iWidget.y( 0 );
      iWidget.rotate( 1 );
      expect( iWidget.rotationIndex() ).toEqual( 0 );
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

    it( 'does not rotate if rotation would cause collision', function() {
      // Embed an i widget into the top left corner of the field
      var iWidget = new SkyBlocks.widget( SkyBlocks.iFigure, field ); 
      iWidget.x( 0 );
      iWidget.y( 0 );
      iWidget.embed();
      // Take another i widget in slightly offset and try to rotate it
      var iWidget = new SkyBlocks.widget( SkyBlocks.iFigure, field ); 
      iWidget.x( 1 );
      iWidget.y( 0 );
      iWidget.rotate( 1 );
      expect( iWidget.rotationIndex() ).toEqual( 0 );
    });
  });

  describe( 'movement left', function() {
    it( 'descreases the x coordinate by 1', function() {
      var initialX = widget.x();
      widget.left();
      expect( widget.x() ).toEqual( initialX - 1 );
    });

    it( 'does not move if movement would case collision', function() {
      var initialX = 0;
      widget.x( initialX );
      widget.left();
      expect( widget.x() ).toEqual( initialX );
    });
  });

  describe( 'movement right', function() {
    it( 'increases the x coordinate by 1', function() {
      var initialX = widget.x();
      widget.right();
      expect( widget.x() ).toEqual( initialX + 1 );
    });

    it( 'does not move if movement would case collision', function() {
      var initialX = field.width() - widget.width();
      widget.x( initialX );
      widget.right();
      expect( widget.x() ).toEqual( initialX );
    });
  });

  describe( 'movement down', function() {
    it( 'increases the y coordinate by 1', function() {
      var initialY = widget.y();
      widget.down();
      expect( widget.y() ).toEqual( initialY + 1 );
    });

    it( 'does not move if movement would case collision', function() {
      var initialY = field.height() - widget.height();
      widget.rotate( 1 ); // rotate to make the i widget vertical
      widget.y( initialY );
      widget.down();
      expect( widget.y() ).toEqual( initialY );
    });
  });

  describe( 'drop', function() {
    it( 'drops the widget all the way down until it collides', function() {
      widget.rotate( 1 ); // rotate to make the i widget vertical
      // should drop all the way to the bottom
      var expectedY = field.height() - widget.height();
      widget.drop();
      expect( widget.y() ).toEqual( expectedY );
    });
  });
});
