describe('Block', function() {
  var block;
  beforeEach(function() {
    block = new Block('red');
  });

  it('has a style', function() {
    expect(block.style()).toEqual('red');
  });
});
