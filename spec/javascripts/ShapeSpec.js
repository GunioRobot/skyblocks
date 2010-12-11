describe('Shape', function() {
  var shape;
  beforeEach(function() {
    shape = new Shape();
  });

  it('should have a width and height', function() {
    expect(shape.width()).not.toBeNull();
    expect(shape.height()).not.toBeNull();
  });

  it('should have a position', function() {
    expect(shape.x()).toEqual(0);
    expect(shape.y()).toEqual(0);
  });

  describe('setting the position', function() {
    beforeEach(function() {
      shape.x(5);
      shape.y(7);
    });

    it('should update the x and y coordinates', function() {
      expect(shape.x()).toEqual(5);
      expect(shape.y()).toEqual(7);
    });
  });
});
