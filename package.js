Package.describe({
  name: 'gadicohen:modules',
  version: '0.0.5', // used in plugin.js too (kinda :) - ask me)!
  summary: 'Minimalist require support, with glslify hack.',
  git: 'https://github.com/gadicc/meteor-modules',
});

Package.registerBuildPlugin({
  name: 'modules.require',
  use: ['underscore'],
  npmDependencies: {
    "sync-exec": "0.5.0",
    "glslify": "1.6.0"
//    "glslify-bundle": "2.0.3"
//    "glslify-deps": "1.2.1"
  },
  sources: [ 'plugin.js' ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('underscore', 'client');
  api.addFiles('modules.js');
  api.export('modules', 'client');
});

/*
Package.onTest(function(api) {
  api.use('tinytest');
  api.use('gadicohen:dirty-require');
  api.addFiles('dirty-require-tests.js');
});
*/