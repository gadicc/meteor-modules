Package.describe({
  name: 'gadicohen:modules',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'modules.require',
  use: ['underscore'],
  npmDependencies: {
    "sync-exec": "0.5.0",
    "glslify": "2.1.2"
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