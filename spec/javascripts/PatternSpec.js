describe('Pattern', function() {

  describe('defining a pattern using a block, width, height, and hex code rotations', function() {
    var greenBlock, pattern;
    beforeEach(function() {
      greenBlock = new Block('green');
      pattern = Pattern.define(greenBlock, 3, 3, [0x78, 0x192, 0x3C, 0x93] ); // L shape
    });

    it('sets the patterns width and height', function() {
      expect(pattern.width()).toEqual(3);
      expect(pattern.height()).toEqual(3);
    });

    it('sets the patterns rotation count', function() {
      expect(pattern.rotationCount()).toEqual(4);
    });

    it('adds the pattern to all available patterns', function() {
      expect(Pattern.patterns).toContain(pattern);
    });

    it('creates the correct block grids', function() {
      var g = greenBlock;
      var n = null;

      var expectedGrids = [
        [[n,g,n],
         [n,g,n],
         [g,g,n]],
        [[g,n,n],
         [g,g,g],
         [n,n,n]],
        [[n,g,g],
         [n,g,n],
         [n,g,n]],
        [[n,n,n],
         [g,g,g],
         [n,n,g]]
      ];

      for(var i = 0; i < pattern.rotationCount(); i++) {
        var grid = pattern.rotationGrid(i);
        var expectedGrid = expectedGrids[i];
        for(var x = 0; x < pattern.width(); x++)
          for(var y = 0; y < pattern.height(); y++)
            expect(grid[x][y]).toEqual(expectedGrid[x][y]);
      }
    });
  });
});
