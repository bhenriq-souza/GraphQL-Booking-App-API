const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const { GraphQLSchemas, GraphQLResolvers } = require('./graphql');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: GraphQLSchemas,
  rootValue: GraphQLResolvers,
  graphiql: true
}));

const connectionString = `mongodb://${
    process.env.MONGO_USER
  }:${
    process.env.MONGO_PASSWORD
  }@graphql-course-shard-00-00-gx1ie.mongodb.net:27017,graphql-course-shard-00-01-gx1ie.mongodb.net:27017,graphql-course-shard-00-02-gx1ie.mongodb.net:27017/${
    process.env.MONGO_DATABASE
  }?ssl=true&replicaSet=graphql-course-shard-0&authSource=admin&retryWrites=true`;
mongoose.connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    console.log(`MongoDB connected to ${process.env.MONGO_DATABASE} ...`);
    app.listen(PORT);
    console.log(`Server listening to port ${PORT} ...`);
  })
  .catch( err => console.log(err));


