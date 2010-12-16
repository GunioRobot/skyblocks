describe( 'Figure', function() {
  describe( 'defining a figure using width, height, and hex code rotations', function() {
    var figure, transforms;
    beforeEach( function() {
      transforms = [ 0x78, 0x192, 0x3C, 0x93 ]; // L figure
      figure = new SkyBlocks.figure( 3, 3, transforms );
    });

    it( 'sets the figure width and height', function() {
      expect( figure.width() ).toEqual( 3 );
      expect( figure.height() ).toEqual( 3 );
    });

    it( 'sets the transforms', function() {
      expect( figure.transforms() ).toEqual( transforms );
    });

    it( 'adds the figure to all available figures', function() {
      expect( SkyBlocks.figures ).toContain( figure );
    });

    it( 'creates the correct blocks', function() {
      var v = figure.value();
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

      for( var i = 0; i < figure.transforms().length; i++ ) {
        var figureBlocks = figure.grids()[i].blocks();
        var expectedBlocks = expected[i];
        for( var x = 0; x < figure.width(); x++ )
          for( var y = 0; y < figure.height(); y++ )
            expect( figureBlocks[x][y] ).toEqual( expectedBlocks[x][y] );
      }
    });
  });
});
