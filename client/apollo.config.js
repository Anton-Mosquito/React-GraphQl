module.exports = {
  client: {
    service: {
      name: 'my-app',
      //   url: 'http://localhost:5001/graphql',
      localSchemaFile: '../server/src/schema.graphql',
    },
    includes: ['src/**/*.{ts,tsx,graphql}'], // де шукати запити
  },
};
