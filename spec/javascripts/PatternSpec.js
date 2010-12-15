describe( 'Pattern', function() {
  describe( 'defining a pattern using width, height, and hex code rotations', function() {
    var pattern, transforms;
    beforeEach( function() {
      transforms = [ 0x78, 0x192, 0x3C, 0x93 ]; // L shape
      pattern = new SkyBlocks.pattern( 3, 3, transforms );
    });

    it( 'sets the patterns width and height', function() {
      expect( pattern.width() ).toEqual( 3 );
      expect( pattern.height() ).toEqual( 3 );
    });

    it( 'sets the transforms', function() {
      expect( pattern.transforms() ).toEqual( transforms );
    });

    it( 'adds the pattern to all available patterns', function() {
      expect( SkyBlocks.patterns ).toContain( pattern );
    });

    it( 'creates the correct blocks', function() {
      var v = pattern.value();
      var expected = [
        [[0,v,0],
         [0,v,0],
         [v,v,0]],
        [[v,0,0],
         [v,v,v],
         [0,0,0]],
        [[0,v,v],
         [0,v,0],
         [0,v,0]],
        [[0,0,0],
         [v,v,v],
         [0,0,v]]
      ];

      for( var i = 0; i < pattern.transforms().length; i++ ) {
        var patternBlocks = pattern.grids()[i].blocks();
        var expectedBlocks = expected[i];
        for( var x = 0; x < pattern.width(); x++ )
          for( var y = 0; y < pattern.height(); y++ )
            expect( patternBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
      }
    });
  });
});
