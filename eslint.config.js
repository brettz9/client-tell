import ashNazg from 'eslint-config-ash-nazg';

export default [
  ...ashNazg(['sauron', 'browser']).map((cfg) => {
    return {
      files: ['index.js'],
      ...cfg
    };
  }),
  ...ashNazg(['sauron', 'node'])
];
