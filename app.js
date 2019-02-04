const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => ['Romantic Cooking', 'Sailing', 'All-night coding'],
    createEvent: args => args.name
  },
  graphiql: true
}));

app.listen(PORT);
console.log(`Server listening to port ${PORT} ...`);
