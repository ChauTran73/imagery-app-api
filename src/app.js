require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router')
const imagesRouter = require('./images/images-router')
const commentsRouter = require('./comments/comments-router')
const authRouter = require('./auth/auth-router')

const app = express()
const morganOption = (NODE_ENV === 'production'? 'tiny'
: 'common');
app.use(cors())
app.use(morgan(morganOption))
app.use(helmet())

app.use('/api/users', usersRouter)
app.use('/api/images', imagesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/auth', authRouter)

// app.use(
//   cors({
//       origin: CLIENT_ORIGIN
//   })
// );

app.use(express.json());



  
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
       response = { error: { message: 'server error' } }
       } else {
        console.error(error)
        response = { message: error.message, error }
      }
      res.status(500).json(response)
})

module.exports =  app
