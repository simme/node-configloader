//
// # ConfigLoader
//
// Loads configuration files based on the current environment.
//
// * _path_: path to the directory containing configuration files.
// * _options_: optional optionas object, for now only has "env" if you'd like
// to load configs for a specific environment.
// * _fn_: optional callback. If left out the configs will be loaded sync.
//
var p       = require('path');
var yaml    = require('js-yaml');
var fs      = require('fs');
var filemap = require('filemap');

module.exports = function (path, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  if (!options) options = {};

  var async = (typeof fn === 'function');
  var env   = options.env || process.env.NODE_ENV || 'dev';
  options.env = env;

  if (async)  loadAsync(path, options, fn);
  else return loadSync(path, options);
};

//
// ## Load sync
//
// Loads configurations sync.
// Throws if no configuration files are found.
//
function loadSync(path, options) {
  var paths = buildPaths(path, options);
  var base  = false;
  var env   = false;

  try { base = require(paths.p1); } catch (err) { }
  try { env  = require(paths.p2); } catch (err) { }

  if (base && env)        return merge(base, env);
  else if (!base && env)  return env;
  else if (!base && !env) throw new Error('No configuration files found.');
  else                    return base;
}

//
// ## Load async
//
// Load configuration files async.
// Stops loading if an error is encountered.
//
function loadAsync(path, options, fn) {
  var paths = buildPaths(path, options);
  var files = {};
  files[paths.p1] = false;
  files[paths.p2] = false;

  // @TODO: perhaps shouldn't rely on everything being UTF-8...
  var parsed = [];
  filemap(files, 'utf-8', function (result) {
    var err;
    for (var i in result) {
      if (result[i]) {
        try { parsed.push(yaml.load(result[i])); }
        catch (error) {
          err = error;
          break;
        }
      }
    }

    if (parsed.length == 1) fn(err, parsed[0]);
    else                    fn(err, merge(parsed[0], parsed[1]));
  });
}

//
// ## Build paths
//
// Returns an object containing paths to base and env configs.
//
function buildPaths(path, options) {
  return {
    p1: p.join(path, 'config.yml'),
    p2: p.join(path, 'config.' + options.env + '.yml')
  };
}

// Deep extend.
// From http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
function merge(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}

