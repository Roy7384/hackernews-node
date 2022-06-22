const { ApolloServer } = require("apollo-server");
// schema
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

// in memory mock data
let links = [
  {
    id: "link-0",
    url: "www.hotwographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

// resolver
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  }
};

// config apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// start the server
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
