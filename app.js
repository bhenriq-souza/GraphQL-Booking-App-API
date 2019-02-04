const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const PORT = 3000;
const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => events,
    createEvent: args => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date
      };
      events.push(event);
      return event;
    }
  },
  graphiql: true
}));

const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-course-shard-00-00-gx1ie.mongodb.net:27017,graphql-course-shard-00-01-gx1ie.mongodb.net:27017,graphql-course-shard-00-02-gx1ie.mongodb.net:27017/test?ssl=true&replicaSet=graphql-course-shard-0&authSource=admin&retryWrites=true`;
mongoose.connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    console.log(`MongoDB connected to graphql-course ...`);
    app.listen(PORT);
    console.log(`Server listening to port ${PORT} ...`);
  })
  .catch( err => console.log(err));


