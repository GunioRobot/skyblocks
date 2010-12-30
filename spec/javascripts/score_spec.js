describe( 'score', function() {

  var score, state;
  beforeEach( function() {
    score = new SkyBlocks.score();
    state = { level: 5 }
  });

  it( 'is initially 0', function() {
    expect( score.score ).toEqual( 0 );
  });

  describe( 'when clearing 0 line', function() {

    beforeEach( function() {
      state.linesCleared = 0;
      score.update( state );
    });

    it( 'should not changed the score', function() {
      expect( score.score ).toEqual( 0 );
    });
  })

  describe( 'when clearing 1 line', function() {

    beforeEach( function() {
      state.linesCleared = 1;
      score.update( state );
    });

    it( 'should increase the score by 4 times the level', function() {
      expect( score.score ).toEqual( 20 );
    });
  })

  describe( 'when clearing 2 lines', function() {

    beforeEach( function() {
      state.linesCleared = 2;
      score.update( state );
    });

    it( 'should increase the score by 10 times the level', function() {
      expect( score.score ).toEqual( 50 );
    });
  })

  describe( 'when clearing 3 lines', function() {

    beforeEach( function() {
      state.linesCleared = 3;
      score.update( state );
    });

    it( 'should increase the score by 30 times the level', function() {
      expect( score.score ).toEqual( 150 );
    });
  })

  describe( 'when clearing 4 lines', function() {

    beforeEach( function() {
      state.linesCleared = 4;
      score.update( state );
    });

    it( 'should increase the score by 120 times the level', function() {
      expect( score.score ).toEqual( 600 );
    });
  })

});
