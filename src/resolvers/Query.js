async function feed(parent, args, context) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } }
        ]
      }
    : {};

  const links = await context.prisma.link.findMany({
    where
  });

  return links;
}

function info() {
  return "Hello, this is the graphql server for a hackernews clone";
}

module.exports = {
  feed,
  info
};
