const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');

// Import schema and rootValue
const { schema, rootValue } = require('./graphql');

mongoose.connect('mongodb://localhost/graphql-demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors()); // Enable CORS
app.use('/api', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

app.listen(4000, () => console.log('Server is running on port 4000'));
