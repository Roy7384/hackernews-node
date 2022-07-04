const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const fs = require("fs");
const path = require("path");

const { getUserId } = require("./utils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");

// resolver
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link
};

// config apollo server
const prisma = new PrismaClient();

// setting up PubSub
const pubsub = new PubSub();

// setting up apollo server
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null
    };
  }
});

// start the server
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
