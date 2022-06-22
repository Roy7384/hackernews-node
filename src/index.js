const { ApolloServer } = require("apollo-server");
const fs = require('fs');
const path = require('path');

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
  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      let linkIndex;

      links.forEach((l, index) => {
        if (l.id === args.id) linkIndex = index;
      });

      links[linkIndex].url = args.url;
      links[linkIndex].description = args.description;

      return links[linkIndex];
    },
    deleteLink: (parent, args) => {
      let newLinks = [];
      let linkToBeDelete;

      links.forEach(link => {
        if (link.id === args.id) {
          linkToBeDelete = link;
          return;
        }
        newLinks.push(link);
      });

      links = newLinks;
      return linkToBeDelete;
    }
  }
};

// config apollo server
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers
});

// start the server
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
