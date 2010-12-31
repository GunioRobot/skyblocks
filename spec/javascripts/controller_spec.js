describe( 'controller', function() {

  var controller;
  beforeEach( function() {
    controller = new SkyBlocks.controller();
  });

  describe( 'sendDown', function() {

    it( 'records the down state of the control', function() {
      expect( controller.isDown( 9 ) ).toBeFalsy();
      controller.sendDown( 9 );
      expect( controller.isDown( 9 ) ).toBeTruthy();
    });
  });

  describe( 'sendUp', function() {

    it( 'records the fact that the control is no longer down', function() {
      controller.sendDown( 9 );
      expect( controller.isDown( 9 ) ).toBeTruthy();
      controller.sendUp( 9 );
      expect( controller.isDown( 9 ) ).toBeFalsy();
    });
  });

  describe( 'update', function() {

    it( 'sets the state controller to itself', function() {
      var state = {};
      controller.update( state );
      expect( state.controller ).toEqual( controller );
    });
  });
});
