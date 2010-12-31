describe( 'field', function() {

  var field;
  beforeEach( function() {
    field = new SkyBlocks.field();
  });

  describe( 'block array', function() {

    it( 'is 10 blocks wide by 20 blocks high', function() {
      expect( field.width ).toEqual( 10 );
      expect( field.height ).toEqual( 20 );
    });

    it( 'is initially empty', function() {
      for( var x = 0; x < field.width; x++ )
        for( var y = 0; y < field.width; y++ )
          expect( field.blocks[ x ][ y ] ).toEqual( 0 );
    });

  });

  describe( 'update', function() {

    it( 'it sets the state field to itself', function() {
      var state = {};
      field.update( state );
      expect( state.field ).toEqual( field );
    });
  });
});
