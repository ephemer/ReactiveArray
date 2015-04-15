Package.describe({
  summary: "Use Blaze's ReactiveVar to make a self-contained reactive array (with push, shift etc.)",
  version: "1.0.0",
  git: ""
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.1.1');
  api.use(['reactive-var', 'underscore']);
  api.addFiles('ephemer:reactive-array.js', 'client');
  api.export('ReactiveArray');
});


// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('ephemer:reactive-array');
//   api.addFiles('ephemer:reactive-array-tests.js');
// });
