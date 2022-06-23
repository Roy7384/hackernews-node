const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } }
    }
  });
}


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

module.exports = {
  signup,
  login,
  post
};
