function Field() {
  this.width = function() { return 10; }
  this.height = function() { return 16; }
  this.block = function(x, y) { return null; }

  var activeShape;
  this.activeShape = function(val) {
    if(typeof val == 'undefined')
      return activeShape;
    activeShape = val;
    var x = Math.floor((this.width() - activeShape.width()) / 2);
    var y = -activeShape.height();
    activeShape.x(x);
    activeShape.y(y);
  }
}
