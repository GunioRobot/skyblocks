describe('Shape', function() {
  var shape;
  beforeEach(function() {
    shape = new Shape();
  });

  it('has a width and height', function() {
    expect(shape.width()).not.toBeNull();
    expect(shape.height()).not.toBeNull();
  });

  describe('position', function() {
    it('is initially at 0, 0', function() {
      expect(shape.x()).toEqual(0);
      expect(shape.y()).toEqual(0);
    });
  });

  describe('setting the position', function() {
    beforeEach(function() {
      shape.x(5);
      shape.y(7);
    });

    it('updates the x and y coordinates', function() {
      expect(shape.x()).toEqual(5);
      expect(shape.y()).toEqual(7);
    });
  });
});
