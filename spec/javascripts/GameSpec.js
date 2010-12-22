describe( 'Game', function() {
  var game
  beforeEach( function() {
    game = new SkyBlocks.game();
  });

  describe( 'score', function() {
    it( 'is initially 0', function() {
      expect( game.score() ).toEqual( 0 );
    });
  });

  describe( 'level', function() {
    it( 'is initially level 1', function() {
      expect( game.level() ).toEqual( 1 );
    });
  });

  describe( 'piece lifetime', function() {
    it( 'does not change if not grounded', function() {
      var initialPiece = game.piece();
      game.update( 0 );
      expect( game.piece() ).toBe( initialPiece ); 
    });

    it( 'changes after grounding', function() {
      var initialPiece = game.piece();
      game.piece().drop();
      game.update( 0 );
      expect( game.piece() ).not.toBe( initialPiece ); 
    });

    it( 'changes to the next figure after grounding', function() {
      var nextFigure = game.nextFigure();
      game.piece().drop();
      game.update( 0 );
      expect( game.piece().figure() ).toBe( nextFigure ); 
    });

    it( 'embeds the piece after grounding', function() {
      var piece = game.piece();
      spyOn( piece, 'embed' );
      piece.drop();
      game.update( 0 );
      expect( piece.embed ).toHaveBeenCalled();
    });

    it( 'clears the field lines after piece is grounded', function() {
      var field = game.field();
      spyOn( field, 'clearLines' );
      game.piece().drop();
      game.update( 0 );
      expect( field.clearLines ).toHaveBeenCalled();
    });
  });

  describe( 'next figure lifetime', function() {
    afterEach( function() {
      // remove the added figure
      SkyBlocks.figures.splice( SkyBlocks.figures.length - 1, 1 );
    });

    it( 'next figure does not change until piece changes', function() {
      var testFigure = new SkyBlocks.figure( 1, 1, [0x0] );
      spyOn( SkyBlocks.figure, 'random' ).andReturn( testFigure );
      game.update( 0 );
      expect( game.nextFigure() ).not.toBe( testFigure );
      game.piece().drop();
      game.update( 0 );
      expect( game.nextFigure() ).toBe( testFigure );
    });
  });

  describe( 'update', function() {
    it( 'updates the piece', function() {
      var piece = game.piece();
      spyOn( piece, 'update' );
      game.update( 2000 );
      expect( piece.update ).toHaveBeenCalledWith( 2000 );
    });
  });

  describe( 'dropping effect on score', function() {
    beforeEach( function() {
      game.score( 100 );
    });

    it( 'increases score by half the number of blocks dropped times the level number', function() {
      var piece = game.piece();
      var initialY = game.piece().y();
      game.piece().drop();
      var newY = game.piece().y();
      game.update( 0 );
      var blocksDropped = newY - initialY;
      var expectedScore = 100 + Math.floor( blocksDropped / 2 ) * game.level();
      expect( game.score() ).toEqual( expectedScore );
    });

    it( 'does not increase the score if not dropped', function() {
      game.update( 0 );
      expect( game.score() ).toEqual( 100 );
    });
  });

  describe( 'clearing lines effect on score', function() {
    var field, piece;
    beforeEach( function() {
      game.score( 100 );
      game.level( 3 );
      field = game.field();
      piece = game.piece();
      spyOn( piece, 'grounded' ).andReturn( true );
    });

    it( 'increases the score by 10 times level for clearing 1 line', function() {
      spyOn( field, 'clearLines' ).andReturn( 1 );
      game.update( 0 );
      expect( field.clearLines ).toHaveBeenCalled();
      expect( game.score() ).toEqual( 130 );
    });

    it( 'increases the score by 25 times level for clearing 2 lines', function() {
      spyOn( field, 'clearLines' ).andReturn( 2 );
      game.update( 0 );
      expect( field.clearLines ).toHaveBeenCalled();
      expect( game.score() ).toEqual( 175 );
    });

    it( 'increases the score by 60 times level for clearing 3 lines', function() {
      spyOn( field, 'clearLines' ).andReturn( 3 );
      game.update( 0 );
      expect( field.clearLines ).toHaveBeenCalled();
      expect( game.score() ).toEqual( 280 );
    });

    it( 'increases the score by 150 times level for clearing 4 lines', function() {
      spyOn( field, 'clearLines' ).andReturn( 4 );
      game.update( 0 );
      expect( field.clearLines ).toHaveBeenCalled();
      expect( game.score() ).toEqual( 550 );
    });
  });

  describe( 'game over', function() {
    it( 'is initially false', function() {
      expect( game.over() ).toBeFalsy();
    });

    it( 'is game over if piece is in a colliding position', function() {
      // fill in the field
      for( var x = 0; x < game.field().width(); x++ ) {
        for( var y = 0; y < game.field().height(); y++ ) {
          game.field().grid().blocks()[x][y] = 1;
        }
      }
      // the piece should never exist in a colliding state, only when attempting
      // movement, if its collding at this point the game is over
      expect( game.over() ).toBeTruthy();
    });
  });
});
