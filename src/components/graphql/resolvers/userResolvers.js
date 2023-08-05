const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');
const logger = require("../../../modules/logger");

const users = [
    { id: 1, username: 'john', password: 'password' },
    { id: 2, username: 'jane', password: 'secret' },
    { id: 3, username: 'mark', password: 'password' },
  ];

const resolvers = {
    hello: (args, context) =>{
      console.log( "context: " , JSON.stringify(context))
      return 'Hello, world!';
    
    },
    user_info: (args, context) => {
      console.log( "context: " , JSON.stringify(context))
      return 'User info';
    },
    protected: (args, context) => {
      console.log( "context: " , JSON.stringify(context))
      if (context.user) {
        return 'Protected information';
      } else {
        throw new Error('Unauthorized');
      }
    },
    login: ({ username, password }) => {
      // Replace this with your own authentication logic (e.g., checking credentials against a database)
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
  
      if (!user) {
        throw new Error('Invalid credentials');
      }
  
      // Generate and return a JWT
      const token = jwt.sign({ userId: user.id }, 'your_secret_key');
      return token;
    },
  };
  