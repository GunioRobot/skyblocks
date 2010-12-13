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

Pattern.random = function() {
  return Pattern.patterns[Math.floor(Math.random() * Pattern.patterns.length)];
}

// define all the patterns
Pattern.define(new Block('red'), 3, 3, [0x3C, 0x192, 0x78, 0x93]); // L
Pattern.define(new Block('green'), 3, 3, [0x138, 0xD2, 0x39, 0x96]); // J
Pattern.define(new Block('yellow'), 3, 3, [0xB8, 0x9A, 0x3A, 0xB2]); // T
Pattern.define(new Block('magenta'), 4, 4, [0xF00, 0x4444]); // I
Pattern.define(new Block('blue'), 3, 3, [0x1E, 0x99]); // S
Pattern.define(new Block('lightblue'), 3, 3, [0x33, 0x5A]); // Z
Pattern.define(new Block('orange'), 2, 2, [0xF]); // O

