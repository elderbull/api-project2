const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes')

//Checks if environment is in production or not
const { environment } = require('./config');
const isProduction = environment === 'production';

//Initializes Express application
const app = express();

//Connects morgan middleware for logging information about requests and responses
app.use(morgan('dev'));

//Parses cookies
app.use(cookieParser());

//Pasrsing JSON bodies of requests
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );

  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );

  //Connects all the routes
  app.use(routes);



  module.exports = app;
