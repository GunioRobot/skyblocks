function Field() {
  this.width = function() { return 10; }
  this.height = function() { return 16; }
  this.block = function(x, y) { return null; }

  var activeShape = null;
  this.activeShape = function(val) {
    if(typeof val == 'undefined')
      return activeShape;
    activeShape = val;
    var x = Math.floor((this.width() - activeShape.width()) / 2);
    var y = -activeShape.height();
    activeShape.x(x);
    activeShape.y(y);
  }

  var gravity = 0.0;
  this.gravity = function(val) {
    if(typeof val == 'undefined')
      return gravity;
    gravity = val;
  }

  this.update = function(elapsed) {
    var cy = (elapsed / 1000.0) * this.gravity();
    shape.y(shape.y() + cy);
  }
}
