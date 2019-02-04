const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Event, User } = require('./models');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String,
      createdEvents: [Event!]
    }
    
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: async () => {
      try {
        const events = await Event
          .find()
          .populate('creator');
        let result = null
        if(events) {
          result = events.map(event => event._doc);
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
    createEvent: async args => {
      const userId = args.eventInput.creator;
      const creator = await User.findOne({ _id: userId });
      if(!creator) {
        throw new Error('User creator does not exists.');
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: userId
      });
      try {
        let result = null;
        result = await event.save();
        if(result) {
          creator.createdEvents.push(result);
          await creator.save();
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
    createUser: async args => {
      try {
        const email = args.userInput.email;
        const userResult = User.findOne({ email: email });
        if(userResult) {
          throw new Error('User already exists.');
        }
        const hash = bcrypt.hashSync(args.userInput.password, 12);
        const user = new User({
          email: args.userInput.email,
          password: hash
        });
        return await user.save();
      } catch (error) {
        throw error;
      }
    }
  },
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


