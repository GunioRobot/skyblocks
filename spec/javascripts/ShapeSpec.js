describe('Shape', function() {
  var shape;
  beforeEach(function() {
    shape = new SkyBlocks.shape();
  });

  it('has a width and height', function() {
    expect(shape.width()).not.toBeNull();
    expect(shape.height()).not.toBeNull();
  });

  it('has a pattern', function() {
    expect(shape.pattern()).not.toBeNull();
  });

  describe('matrix', function() {
    it('is set to the first matrix of the shape pattern', function() {
      var shapeMatrix = shape.matrix();
      var patternMatrix = shape.pattern().matrices[0];
      for(var x = 0; x < shape.width(); x++)
        for(var y = 0; y< shape.height(); y++)
          expect(shapeMatrix[x][y]).toEqual(patternMatrix[x][y]);
    });
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

  describe('counter clockwise rotation', function() {
    it('updates the rotation index', function() {
      var current = shape.rotationIndex();
      var expected = current + 1;
      if(expected >= shape.pattern().matrices().length)
        expected = 0;
      shape.rotate(1);
      expect(shape.rotationIndex()).toEqual(expected);
    });

    it('restarts when passing last rotation', function() {
      var initial = shape.rotationIndex(); 
      for(var i = 0; i < shape.pattern().matrices().length; i++)
        shape.rotate(1);
      expect(shape.rotationIndex()).toEqual(initial);
    });

    it('updates the grid to the patterns next rotation grid', function() {
      shape.rotate(1);
      var expectedGrid = shape.pattern().matrices()[shape.rotationIndex];
      for(var x = 0; x < shape.width(); x++)
        for(var y = 0; y < shape.height(); y++)
          expect(shapeGrid[x][y]).toEqual(expectedGrid[x][y]);
    });
  });

  describe('clockwise rotation', function() {
    it('updates the rotation index', function() {
      var current = shape.rotationIndex();
      var expected = current - 1;
      if(expected < 0)
        expected = shape.pattern().matrices().length - 1;
      shape.rotate(-1);
      expect(shape.rotationIndex()).toEqual(expected);
    });

    it('restarts when passing last rotation', function() {
      var initial = shape.rotationIndex(); 
      for(var i = 0; i < shape.pattern().matrices().length; i++)
        shape.rotate(-1);
      expect(shape.rotationIndex()).toEqual(initial);
    });

    it('updates the grid to the patterns next rotation grid', function() {
      shape.rotate(-1);
      var expectedGrid = shape.pattern().matrices()[shape.rotationIndex];
      for(var x = 0; x < shape.width(); x++)
        for(var y = 0; y< shape.height(); y++)
          expect(shapeGrid[x][y]).toEqual(expectedGrid[x][y]);
    });
  });
});
