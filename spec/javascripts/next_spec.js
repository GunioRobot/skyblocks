describe( 'next', function() {
  
  var next;
  beforeEach(function() {
    next = new SkyBlocks.next();
  });

  describe( 'figure', function() {

    it( 'is initially set to a figure', function() {
      expect( next.figure ).toBeDefined();
      expect( next.figure ).not.toBeNull();
    });
  });

  describe( 'update', function() {

    describe( 'when a piece did not land', function() {

      var figure;
      beforeEach( function() {
        figure = next.figure;
        next.update( { pieceLanded: false } );
      });

      it( 'does not update the figure', function() {
        expect( next.figure ).toEqual( figure );
      });
    });

    describe( 'when a piece landed', function() {

      beforeEach( function() {
        // force Math.random to return a fixed value that the last figure can be expected
        spyOn( Math, 'random' ).andReturn( .999 );
        next.update( { pieceLanded: true } );
      });

      it( 'updates to a random figure', function() {
        expect( next.figure ).toEqual( SkyBlocks.figures[ SkyBlocks.figures.length - 1 ] );
      });

    });
  });
});
