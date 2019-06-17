const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const morgan = require ('morgan');
const errorHandler = require ('errorhandler');

const apiRouter = require('./api/api');

const app = express();

const port = 4000 || process.env.PORT;

/* body-parser, cors, error handler and morgan will be used for all routes
bodyParser.json() will only parse json among request bodies
cors is a middleware for cross origin ressource sharing
errorhandler helps for boilerplate errorhandling in express
morgan is a HTTP request logger middleware
*/

app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler())
app.use(morgan('dev'));

app.use('/api',apiRouter);

app.listen(port,()=>{console.log(`server running on port ${port}`)});

module.exports = app; // module.exports = app