var assert = require('assert');
var config = require('../configloader');

// Remove loaded yaml files from cache
setup(function () {
  for (var i in require.cache) {
    if (i.match(/yml$/)) {
      delete require.cache[i];
    }
  }
});

suite('Test configloader.', function () {
  test('Load base config sync', function () {
    var c = config(__dirname + '/configs2');
    assert.equal(c.base.foo, 'a');
    assert.equal(c.http.port, 80);
  });

  test('Load base and env sync', function () {
    var c = config(__dirname + '/configs', {env: 'dev'});
    assert.equal(c.base.baz, 'f');
    assert.equal(c.http.port, 1337);
  });

  test('Load base config async', function (done) {
    config(__dirname + '/configs2', function (err, c) {
      assert.equal(c.base.foo, 'a');
      assert.equal(c.http.port, 80);
      done();
    });
  });

  test('Load base and env async', function (done) {
    config(__dirname + '/configs', function (err, c) {
      assert.equal(c.base.baz, 'f');
      assert.equal(c.http.port, 1337);
      done();
    });
  });

  test('Loading invalid yaml async gives error', function (done) {
    config(__dirname + '/configs3', function (err, c) {
      assert(err);
      done();
    });
  });

  test('Loading non-existant sync throws', function () {
    assert.throws(function () {
      var c = config(__dirname + '/configs4');
    });
  });
});

