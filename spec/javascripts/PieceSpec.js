describe( 'Piece', function() {
  var figure, field, piece, singleBlockFigure;
  beforeEach( function() {
    figure = SkyBlocks.iFigure;
    field = new SkyBlocks.field();
    piece = new SkyBlocks.piece( figure, field );
    singleBlockFigure = new SkyBlocks.figure( 3, 3, [0x10] );
  });

  it( 'figure and field are set', function() {
    expect( piece.figure() ).toBe( figure );
    expect( piece.field() ).toBe( field );
  });

  describe( 'width', function() {
    it( 'is equal to the figure width', function() {
      expect( piece.width() ).toEqual( piece.figure().width() );
    });
  });

  describe( 'height', function() {
    it( 'is equal to the figure height', function() {
      expect( piece.height() ).toEqual( piece.figure().height() );
    });
  });

  describe( 'grid', function() {
    it( 'is set to the first grid of the piece figure', function() {
      var pieceBlocks = piece.grid().blocks();
      var figureBlocks = piece.figure().grids()[0].blocks();
      for( var x = 0; x < piece.width(); x++ )
        for( var y = 0; y< piece.figure().height(); y++ )
          expect( pieceBlocks[x][y] ).toEqual( figureBlocks[x][y] );
    });
  });

  describe( 'position', function() {
    it( 'is starts at the top center of the field', function() {
      var x = Math.floor( ( field.width() - piece.width() ) / 2 );
      var y = 0;
      expect( piece.x() ).toEqual( x );
      expect( piece.y() ).toEqual( y );
    });
  });

  describe( 'setting the position', function() {
    beforeEach( function() {
      piece.x( 5 );
      piece.y( 7 );
    });

    it( 'updates the x and y coordinates', function() {
      expect( piece.x() ).toEqual( 5 );
      expect( piece.y() ).toEqual( 7 );
    });
  });

  describe( 'effect of field gravity on piece', function() {
    beforeEach( function() {
      field.gravity( 2.5 ); // 2.5 blocks per second
    });

    it( 'moves the piece down correctly over time', function() {
      var initialX = piece.x();
      var initialY = piece.y();
      piece.update( 3000 ); // advance 3 seconds
      expect( piece.x() ).toEqual( initialX );
      expect( piece.y() ).toEqual( initialY + 7.5 );
    });

    it( 'only moves the piece down until it collides', function() {
      var initialX = piece.x();
      var initialY = piece.y();
      // rotate to make the i piece vertical
      piece.transform( SkyBlocks.piece.transformations.counterClockwise ); 
      piece.update( 30000 ); // advance 30 seconds
      expect( piece.x() ).toEqual( initialX );
      // should only be at the bottom of the field
      expect( piece.y() ).toEqual( field.height() - piece.height() );
    });
  });

  describe( 'embed', function() {
    beforeEach( function() {
      piece.x( 4 );
      piece.y( 5 );
      piece.embed();
    });

    it( 'copies the piece blocks into the field blocks', function() {
      for( var x = 0; x < piece.width(); x++ ) {
        for( var y = 0; y < piece.height(); y++ ) {
          var fieldX = piece.x() + x;
          var fieldY = piece.y() + y;
          if( fieldX < 0 || fieldX >= field.width() || fieldY < 0 || fieldY > field.height() )
            continue;
          var fieldBlock = field.grid().blocks()[fieldX][fieldY];
          var pieceBlock = piece.grid().blocks()[x][y];
          expect( fieldBlock ).toEqual( pieceBlock );
        }
      }
    });

    it( 'does not embed empty space over already embedded blocks', function() {
      // embed two single block pieces, on offset by one block
      var piece1 = new SkyBlocks.piece( singleBlockFigure, field );
      var piece2 = new SkyBlocks.piece( singleBlockFigure, field );
      piece1.x( 0 );
      piece1.y( 0 );
      piece1.embed();
      piece2.x( 1 );
      piece2.y( 1 );
      piece2.embed();
      // make sure both blocks are in the field afterwads
      var block1 = field.grid().blocks()[1][1];
      var block2 = field.grid().blocks()[2][2];
      expect( block1 ).not.toEqual( 0 );
      expect( block2 ).not.toEqual( 0 );
    });
  });

  describe( 'collision', function() {
    beforeEach( function() {
      piece = new SkyBlocks.piece( singleBlockFigure, field );
      piece.y( 5 );
    });

    it( 'does not initally collide', function() {
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'does not collide if out of bounds to the left of the field but all blocks are in bounds', function() {
      piece.x( -1 );
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds to the left of the field', function() {
      piece.x( -2 );
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'does not collide if out of bounds to the right of the field but all blocks are in bounds', function() {
      piece.x( field.width() - 2 );
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds to the right of the field', function() {
      piece.x( field.width() - 1 );
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'does not collide if out of bounds to the top of the field but all blocks are in bounds', function() {
      piece.y( -1 );
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are out of bounds on the top of the field', function() {
      piece.y( -3 );
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'does not collide if out if below the bottom of the field but blocks are in bounds', function() {
      piece.y( field.height() - 2 );
      expect( piece.collides() ).toBeFalsy();
    });

    it( 'collides if any blocks are below the bottom of the field', function() {
      piece.y( field.height() - 1 );
      expect( piece.collides() ).toBeTruthy();
    });

    it( 'collides if overlaps any other blocks embedded in the field', function() {
      var embedPiece = new SkyBlocks.piece( singleBlockFigure, field );
      embedPiece.x( 2 );
      embedPiece.y( 5 );
      embedPiece.embed();
      piece.x( 2 );
      piece.y( 5 );
      expect( piece.collides() ).toBeTruthy();
    });
  });

  describe( 'counter clockwise rotation', function() {
    it( 'updates the rotation index', function() {
      var current = piece.rotationIndex();
      var expected = current + 1;
      if( expected >= piece.figure().rotations().length )
        expected = 0;
      piece.transform( SkyBlocks.piece.transformations.counterClockwise );
      expect( piece.rotationIndex() ).toEqual( expected );
    });

    it( 'restarts when passing last rotation', function() {
      var initial = piece.rotationIndex(); 
      for( var i = 0; i < piece.figure().rotations().length; i++ )
        piece.transform( SkyBlocks.piece.transformations.counterClockwise );
      expect( piece.rotationIndex() ).toEqual( initial );
    });

    it( 'updates the grid to the figures next rotation grid', function() {
      piece.transform( SkyBlocks.piece.transformations.counterClockwise );
      var pieceBlocks = piece.grid().blocks();
      var expectedBlocks = piece.figure().grids()[ piece.rotationIndex() ].blocks();
      for( var x = 0; x < piece.width(); x++ )
        for( var y = 0; y < piece.figure().height(); y++ )
          expect( pieceBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
    });

    it( 'does not rotate if rotation would cause collision', function() {
      // Embed an i piece into the top left corner of the field
      var iPiece = new SkyBlocks.piece( SkyBlocks.iFigure, field ); 
      iPiece.x( 0 );
      iPiece.y( 0 );
      iPiece.embed();
      // Take another i piece in slightly offset and try to rotate it
      var iPiece = new SkyBlocks.piece( SkyBlocks.iFigure, field ); 
      iPiece.x( 1 );
      iPiece.y( 0 );
      iPiece.transform( SkyBlocks.piece.transformations.counterClockwise );
      expect( iPiece.rotationIndex() ).toEqual( 0 );
    });
  });

  describe( 'clockwise rotation', function() {
    it( 'updates the rotation index', function() {
      var current = piece.rotationIndex();
      var expected = current - 1;
      if( expected < 0 )
        expected = piece.figure().rotations().length - 1;
      piece.transform( SkyBlocks.piece.transformations.clockwise );
      expect( piece.rotationIndex() ).toEqual( expected );
    });

    it( 'restarts when passing last rotation', function() {
      var initial = piece.rotationIndex(); 
      for( var i = 0; i < piece.figure().rotations().length; i++ )
        piece.transform( SkyBlocks.piece.transformations.clockwise );
      expect( piece.rotationIndex() ).toEqual( initial );
    });

    it( 'updates the grid to the figures next rotation grid', function() {
      piece.transform( SkyBlocks.piece.transformations.clockwise )
      var pieceBlocks = piece.grid().blocks();
      var expectedBlocks = piece.figure().grids()[ piece.rotationIndex() ].blocks();
      for( var x = 0; x < piece.width(); x++ )
        for( var y = 0; y< piece.figure().height(); y++ )
          expect( pieceBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
    });

    it( 'does not rotate if rotation would cause collision', function() {
      // Embed an i piece into the top left corner of the field
      var iPiece = new SkyBlocks.piece( SkyBlocks.iFigure, field ); 
      iPiece.x( 0 );
      iPiece.y( 0 );
      iPiece.embed();
      // Take another i piece in slightly offset and try to rotate it
      var iPiece = new SkyBlocks.piece( SkyBlocks.iFigure, field ); 
      iPiece.x( 1 );
      iPiece.y( 0 );
      iPiece.transform( SkyBlocks.piece.transformations.counterClockwise );
      expect( iPiece.rotationIndex() ).toEqual( 0 );
    });
  });

  describe( 'movement left', function() {
    it( 'descreases the x coordinate by 1', function() {
      var initialX = piece.x();
      piece.transform( SkyBlocks.piece.transformations.left );
      expect( piece.x() ).toEqual( initialX - 1 );
    });

    it( 'does not move if movement would case collision', function() {
      var initialX = 0;
      piece.x( initialX );
      piece.transform( SkyBlocks.piece.transformations.left );
      expect( piece.x() ).toEqual( initialX );
    });
  });

  describe( 'movement right', function() {
    it( 'increases the x coordinate by 1', function() {
      var initialX = piece.x();
      piece.transform( SkyBlocks.piece.transformations.right );
      expect( piece.x() ).toEqual( initialX + 1 );
    });

    it( 'does not move if movement would case collision', function() {
      var initialX = field.width() - piece.width();
      piece.x( initialX );
      piece.transform( SkyBlocks.piece.transformations.right );
      expect( piece.x() ).toEqual( initialX );
    });
  });

  describe( 'movement down', function() {
    it( 'increases the y coordinate by 1', function() {
      var initialY = piece.y();
      piece.transform( SkyBlocks.piece.transformations.down );
      expect( piece.y() ).toEqual( initialY + 1 );
    });

    it( 'does not move if movement would case collision', function() {
      var initialY = field.height() - piece.height();
      // rotate to make the i piece vertical
      piece.transform( SkyBlocks.piece.transformations.counterClockwise );
      piece.y( initialY );
      piece.transform( SkyBlocks.piece.transformations.down );
      expect( piece.y() ).toEqual( initialY );
    });
  });

  describe( 'drop', function() {
    it( 'drops the piece all the way down until it collides', function() {
      // rotate to make the i piece vertical
      piece.transform( SkyBlocks.piece.transformations.counterClockwise ); 
      // should drop all the way to the bottom
      var expectedY = field.height() - piece.height();
      piece.drop();
      expect( piece.y() ).toEqual( expectedY );
    });

    it( 'fires the dropped event with the number of lines dropped', function() {
      var dropped = false; 
      var linesDropped = 0;
      piece.dropped( function( lines ) { 
        dropped = true; 
        linesDropped = lines; 
      });
      var initialY = piece.y();
      piece.drop();
      var newY = piece.y();
      var expectedLines = newY - initialY;
      expect( dropped ).toBeTruthy();
      expect( linesDropped ).toEqual( expectedLines );
    });
  });

  describe( 'grounded', function() {
    it( 'returns false if will not collide by moving down', function() {
      expect( piece.grounded() ).toBeFalsy();
    });

    it( 'returns true if it will collide by moving down', function() {
      piece.drop();
      expect( piece.grounded() ).toBeTruthy();
    });
  });
});
