describe( 'figure', function() {

  describe( 'defining a figure using width, height, and hex code orientations', function() {

    var figure, orientations;
    beforeEach( function() {
      orientations = [ 0x78, 0x192, 0x3C, 0x93 ]; // L figure
      figure = new SkyBlocks.figure( 3, 3, orientations );
    });

    it( 'creates the correct lines for the orientations', function() {
      var expected = [ [[2],[0,1,2],[]], [[0,1],[1],[1]], [[],[0,1,2],[0]], [[1],[1],[1,2]] ];

      expect( figure.orientations.length ).toEqual( orientations.length );

      for( var i = 0; i < figure.orientations.length; i++ ) {
        var figureLines = figure.orientations[ i ];
        var expectedLines = expected[ i ];
        for( var y = 0; y < figure.height; y++ )
          expect( figureLines[ y ] ).toEqual( expectedLines[ y ] );
      }
    });
  });
});
