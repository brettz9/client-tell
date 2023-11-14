'use strict';

module.exports = {
  extends: 'ash-nazg/sauron-node-overrides',
  settings: {
    polyfills: [
      'Array.from',
      'Object.entries',
      'Promise',
      'URL'
    ]
  },
  rules: {
  }
};
