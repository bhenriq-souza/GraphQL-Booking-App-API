const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

/** Default route */
app.get('/', (req, res, next) => res.send('Hello, world!'));

app.listen(PORT);
console.log(`Server listening to port ${PORT} ...`);
