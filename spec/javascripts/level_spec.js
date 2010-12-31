describe( 'level', function() {

  var startLevel, level;
  beforeEach( function() {
    startLevel = 3;
    level = new SkyBlocks.level( startLevel );
  });

  it( 'starts at the starting level', function() {
    expect( level.level ).toEqual( 3 );
  });

  describe( 'update', function() {

    it( 'sets the state level to the level', function() {
      var state = { linesCleared: 0 };
      level.update( state );
      expect( state.level ).toEqual( level.level );
    });

    it( 'should change levels every 10 lines', function() {
      level.update( { linesCleared: 5 } );
      expect( level.level ).toEqual( startLevel );
      level.update( { linesCleared: 5 } );
      expect( level.level ).toEqual( startLevel + 1 );
      level.update( { linesCleared: 5 } );
      expect( level.level ).toEqual( startLevel + 1 );
      level.update( { linesCleared: 5 } );
      expect( level.level ).toEqual( startLevel + 2 );
    });
  });

});
