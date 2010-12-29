describe( 'figure', function() {

  describe( 'defining a figure using width, height, and hex code orientations', function() {

    var figure, orientations;
    beforeEach( function() {
      orientations = [ 0x78, 0x192, 0x3C, 0x93 ]; // L figure
      figure = new SkyBlocks.figure( 3, 3, orientations );
    });

    it( 'creates the correct blocks for the orientations', function() {
      var expected = [
        [[0,1,0],
         [0,1,0],
         [1,1,0]],
        [[1,0,0],
         [1,1,1],
         [0,0,0]],
        [[0,1,1],
         [0,1,0],
         [0,1,0]],
        [[0,0,0],
         [1,1,1],
         [0,0,1]]
      ];

      expect( figure.orientations.length ).toEqual( orientations.length );

      for( var i = 0; i < figure.orientations.length; i++ ) {
        var figureBlocks = figure.orientations[ i ];
        var expectedBlocks = expected[ i ];
        for( var x = 0; x < figure.width; x++ )
          for( var y = 0; y < figure.height; y++ )
            expect( figureBlocks[ x ][ y ] ).toEqual( expectedBlocks[ x ][ y ] );
      }
    });
  });
});
