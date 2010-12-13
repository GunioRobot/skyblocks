function Shape() {
  this.width = function() { return 0; }
  this.height = function() { return 0; }

  var x = 0;
  this.x = function(val) { 
    if(typeof val == 'undefined')
      return x;
    x = val
  }

  var y = 0;
  this.y = function(val) { 
    if(typeof val == 'undefined')
      return y;
    y = val;
  }

  var pattern = Pattern.random();
  this.pattern = function() { return pattern; }

  this.grid = function() { return pattern.rotationGrid(0); }

  var rotationIndex = 0;
  this.rotationIndex = function() { return rotationIndex; }

  this.rotate = function(direction) {
    rotationIndex += direction;
    if(rotationIndex == pattern.rotationCount())
      rotationIndex = 0;
    else if(rotationIndex < 0)
      rotationIndex = pattern.rotationCount() - 1;
  }
}
