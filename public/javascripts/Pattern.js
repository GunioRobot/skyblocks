function Pattern(block, width, height, rotations) {
  this.width = function() { return width; }
  this.height = function() { return height; }
  this.rotationCount = function() { return rotations.length; }

  var rotationGrids = [];
  this.rotationGrid = function(rotationIndex) { return rotationGrids[rotationIndex]; }

  for(var i = 0; i < this.rotationCount(); i++) {
    var blocks = new Array(this.width());
    for (var x = 0; x < width; x++)
      blocks[x] = new Array(this.height());

    var n = 0;
    var blockCount = (this.width() * this.height());
    for(var y = 0; y < this.height(); y++) {
      for(var x = 0; x < this.width(); x++) {
        var f = Math.pow(2, blockCount - 1 - n);
        blocks[x][y] = ((rotations[i] & f) / f) > 0 ? block : null;
        n++;
      }
    }

    rotationGrids[i] = blocks;
  }
}

Pattern.patterns = [];
Pattern.define = function(block, width, height, rotations) {
  var pattern = new Pattern(block, width, height, rotations);
  Pattern.patterns.push(pattern);
  return pattern;
}
