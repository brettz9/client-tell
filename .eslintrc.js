module.exports = {
  "extends": "ash-nazg/sauron-node",
  "settings": {
    "polyfills": [
      "Array.from",
      "Object.entries",
      "Promise",
      "URL"
    ]
  },
  "overrides": [
      {
          "files": ["server.js"],
          "globals": {
              "require": "readonly"
          }
      }
  ],
  "rules": {
    "indent": ["error", 4],
    "max-len": 0,
    "unicorn/no-unsafe-regex": 0
  }
};
