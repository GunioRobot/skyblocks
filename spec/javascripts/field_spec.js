describe( 'field', function() {

  var field;
  beforeEach( function() {
    field = new SkyBlocks.field();
  });

  it( 'has a width of 10', function() {
    expect( field.width ).toEqual( 10 );
  });

  describe( 'lines', function() {

    it( '20 lines high', function() {
      expect( field.lines.length ).toEqual( 20 );
    });

    it( 'is initially empty', function() {
      for( var i = 0; i < field.lines.length; i++ )
        expect( field.lines[ i ].length ).toEqual( 0 );
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
