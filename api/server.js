const express = require('express');
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const dbConnection = require('../database/dbConfig.js')

const authRouter = require('../auth/auth-router.js')
const usersRouter = require('../users/users-router.js')

const apiRouter = require('./api-router.js');
// const configureMiddleware = require('./configure-middleware.js');

const server = express();
const sessionConfig = {
    name: "cookieMonster",
    secret: process.env.SESSION_SECRET || "it's a secret", // use for cookie encryption
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 min in ms
      secure: false, // set to true in production, only send cookies over HTTPS
      httpOnly: true, // js cannot access the cookies on the browser
  
    },
    resave: false,
    saveUninitialized: true,// read about it for GDPR compliance
    store: new KnexSessionStore({
      knex: dbConnection,
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 60000 // 60000 ms
  
  
    })
  }

server.use(helmet())
server.use(session(sessionConfig))
server.use(express.json())
server.use(cors())

// configureMiddleware(server);

server.use('/api', apiRouter);

module.exports = server;
