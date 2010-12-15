describe( 'Grid', function() {
  describe( 'creating from a width, height, block value, and hex code', function() {
    var grid;
    beforeEach( function() {
      grid = new SkyBlocks.grid( 4, 3, 2, 0x50C );
    });

    it( 'should have the correct width and height', function() {
      expect( grid.width() ).toEqual( 4 );
      expect( grid.height() ).toEqual( 3 );
    });

    it( 'should create the correct multi-dimensional array of block values', function() {
      var expected = [[0,0,2],[2,0,2],[0,0,0],[2,0,0]];
      for( var x = 0; x < grid.width(); x++ )
        for( var y = 0; y < grid.height(); y++ )
          expect( grid.blocks()[x][y] ).toEqual( expected[x][y] );
    });
  });
});
