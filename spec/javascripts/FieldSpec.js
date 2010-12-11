describe('Field', function() {
  var field;
  beforeEach(function() {
    field = new Field();
  });

  it('should be 10 x 16', function() {
    expect(field.width()).toEqual(10);
    expect(field.height()).toEqual(16);
  });

  it('should be initially empty', function() {
    for(var x = 0; x < field.width(); x++)
      for(var y = 0; y < field.height(); y++)
        expect(field.block(x, y)).toBeNull();
  });

  describe('setting the active shape', function() {
    var shape;
    beforeEach(function() {
      shape = new Shape();
      field.activeShape(shape);
    });

    it('should be able to return the active shape', function() {
      expect(field.activeShape()).toBe(shape);
    });

    it('should move the shape at the top center of the field', function() {
      var x = Math.floor((field.width() - shape.width()) / 2);
      var y = -shape.height();
      expect(shape.x()).toEqual(x);
      expect(shape.y()).toEqual(y);
    });
  });
});
