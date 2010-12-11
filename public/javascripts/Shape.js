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
}
