// dependencies
const express      = require("express");
const app          = express();
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const session 	   = require('express-session');
const bodyParser 	 = require('body-parser');

// file storage session
const FSStore  	   = require('./app/helper/session')({ session: session });

// setup configuration
global.environment = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() : "development";
global.config      = (require("./app/config")[environment]) ? require("./app/config")[environment] : require("./app/config")["development"];

// parse application/json
app.use(bodyParser.json({limit: '20mb'}));
app.use(logger('dev'));

app.use(cookieParser());

// set default headers
app.use((req, res, callback)=> {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,secKey,AuthKey');
	res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === "OPTIONS") return res.sendStatus(200);
  callback();
});

// Initialize session
app.use(session({
	key: 'sessionid',
	secret: 'aersda@#$32sfas2342',
	resave: true,
	saveUninitialized: false,
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
	store: new FSStore({ path: '/tmp/sessions', reapInterval: -1 })
}));

// set up database connection
app.use(async (req, res, callback)=> {
   try {
     req.db = await require('./app/helper/db').connectDb();
     callback();
   } catch(e) { return res.sendStatus(503) /* send 404 in case of error  // TODO: handle error properly*/ }
});

// routes
require('./app/routes')(app);

// handle errors
app.use((err, req, res, callback)=> {
  console.error(err);
  return res.sendStatus(503); // TODO:handle error;
})

// run server
app.listen(config.port);
console.log(`server is running on ${config.port} now`);
