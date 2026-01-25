module.exports = {
  src: './',
  schema: './schema.graphql',
  exclude: ['**/node_modules/**', '**/__generated__/**', '**/.*', 'assets/**', 'scripts/**'],
  language: 'typescript',
  artifactDirectory: './__generated__',
  eagerEsModules: true,
};
