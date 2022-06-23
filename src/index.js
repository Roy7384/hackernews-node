const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const fs = require("fs");
const path = require("path");

// resolver
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (parent, args, context) => {
      return context.prisma.link.findMany();
    }
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      });
      return newLink;
    },
    // To do: refactor to use prisma client

    // updateLink: (parent, args) => {
    //   let linkIndex;

    //   links.forEach((l, index) => {
    //     if (l.id === args.id) linkIndex = index;
    //   });

    //   links[linkIndex].url = args.url;
    //   links[linkIndex].description = args.description;

    //   return links[linkIndex];
    // },
    // deleteLink: (parent, args) => {
    //   let newLinks = [];
    //   let linkToBeDelete;

    //   links.forEach(link => {
    //     if (link.id === args.id) {
    //       linkToBeDelete = link;
    //       return;
    //     }
    //     newLinks.push(link);
    //   });

    //   links = newLinks;
    //   return linkToBeDelete;
    // }
  }
};

// config apollo server
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma
  }
});

// start the server
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
