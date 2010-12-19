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
      expect( game.level() ).toEqual( SkyBlocks.level1 );
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
