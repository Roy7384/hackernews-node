function feed(parent, args, context) {
  return context.prisma.link.findMany();
}

function info() {
  return "Hello, this is the graphql server for a hackernews clone";
}

module.exports = {
  feed,
  info
};