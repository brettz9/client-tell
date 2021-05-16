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
  overrides: [
    {
      files: ['.eslintrc.js', 'server.js'],
      env: {
        node: true
      },
      globals: {
        module: 'readonly'
      },
      parserOptions: {
        sourceType: 'script'
      },
      rules: {
        'import/no-commonjs': 'off',
        strict: ['error', 'global']
      }
    },
    {
      files: ['server.js'],
      globals: {
        require: 'readonly'
      }
    }
  ],
  rules: {
    'max-len': 0,
    'unicorn/no-unsafe-regex': 0
  }
};
