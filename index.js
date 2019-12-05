import Apollo from "apollo-server";
import connectDB from './mongo-connector.js';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';

const dbURL = 'mongodb://localhost:27017/artsdb';

const run = async (db) => {

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new Apollo.ApolloServer({ typeDefs, resolvers });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

  console.log("••• finished startup");
};

Promise.resolve({dbURL, mongoOpts: { useUnifiedTopology: true }})
  .then(connectDB)
  .then(run)
  .catch(e => {
    console.error(e);
    process.exit();// What code means there was an error? Is there such a code?
  });


