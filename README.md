## gadicohen:modules

Minimalist require support, with glslify hack.

*Don't use this*

Rather use:

* [raix:famono](https://atmospherejs.com/?q=famono)
* [rocket:module](https://atmospherejs.com/rocket/module)
* [cosmos:browserify](https://atmospherejs.com/cosmos/browserify)

I guess it's ok to use this if you have a good reason:

* Writing a plugin that needs to work with multiple build systems
* Want the glslify hack for Famous mixed mode shaders
* Dev work with local fork, etc.

### Example:

**lib/modules.require**:

```
famous = require('./famous');
```

**package.js:**

```js
Package.onUse(function(api) {
  api.use('gadicohen:modules@0.0.1', 'client');
  api.addFiles('lib/modules.require', 'client');
  api.export('famous', 'client');
});
```
