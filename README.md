ConfigLoader
------------

Load YAML configs based on current node environment.

# Usage

Let's say you have this kind of config setup:

    config/
      config.yml              // Shared configuration
      config.dev.yml          // Extended dev configuration
      config.production.yml   // Extended production configuration

Then _ConfigLoader_ can help you load these based on current environment. Let's
say you are running node in a development environment by setting `NODE_ENV`:

`$ NODE_ENV=dev node yourapp.js`

_ConfigLoader_ would then load up `config.yml` and extend it
with `config.dev.yml`.

Your `config.yml` might look like this:

```yaml
site:
  title: My Awesome Site

http:
  port: 80

database:
  user:
  pass:
```

And your `config.dev.yml` might look like this:

```yaml
http:
  port: 1337

database:
  user: root
  pass: IAMMEGAHAxx00r
```

The loaded configuration would then be:

```js
{ site: { title: "My Awesome Site" },
  http: { port: 1337 },
  database: { user: 'root', pass: 'IAMMEGAHAxx00r' }
}
```

## API

_ConfigLoader_ is one single function that behaves a bit differently depending
on what arguments you give it.

### Loading configurations synchronously

If you do not give _ConfigLoader_ a callback function it will do the loading
synchronously.

```js
var configloader = require('configloader');
var config = configloader('path/to/configs');
```

If `path/to/configs` does not contain any files matching the requirements an
error will be thrown if loading is done synchronously.

### Loading configurations asynchronously

If you _do_ give _ConfigLoader_ a callback function it will return the loaded
configuration to that function.

```js
var configloader = require('condigloader');
configloader('path/to/configs', function (err, config) {
  if (err) {
    console.log('had an error :(');
    return;
  }

  console.log(config);
});
```

If any of the configuration files contains YAML errors the `err` argument will
be the error from [js-yaml](http://nodeca.github.com/js-yaml/).

If no configurations files were found in `path/to/configs` I think you will
get `undefined` as the second argument. :P

### Forcing environment

If you want to force a certain environent to be used you can pass
```js
{ env: 'other-env' }
```
as a second argument to `configloader()`.

# Conventions

By convention _ConfigLoader_ requires you to name your configuration files
using this pattern:
`config(\.environment)?\.yml`

If you'd like to change this pull requests making more use of the `options`
argument are very much welcome!

If _ConfigLoader_ can't find any configured environment it will fall back on
`dev`.

# Installation

Install with npm:
`$ npm install configloader`

# Testing

Tests are written using `mocha`.

# License

ISC

