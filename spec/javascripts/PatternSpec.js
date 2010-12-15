describe( 'Pattern', function() {
  describe( 'defining a pattern using a block, width, height, and hex code rotations', function() {
    var pattern;
    beforeEach( function() {
      pattern = new SkyBlocks.pattern( 3, 3, [ 0x78, 0x192, 0x3C, 0x93 ] ); // L shape
    });

    it( 'sets the patterns width and height', function() {
      expect( pattern.width() ).toEqual( 3 );
      expect( pattern.height() ).toEqual( 3 );
    });

    it( 'adds the pattern to all available patterns', function() {
      expect( SkyBlocks.patterns ).toContain( pattern );
    });

    it( 'creates the correct matrices', function() {
      var v = pattern.value();
      var matrices = [
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
        var matrix = pattern.matrices()[i];
        var expected = matrices[i];
        for( var x = 0; x < pattern.width(); x++ )
          for( var y = 0; y < pattern.height(); y++ )
            expect( matrix[x][y] ).toEqual( expected[x][y] );
      }
    });
  });
});
