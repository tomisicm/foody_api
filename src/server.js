import express from 'express'
import http from 'http'

import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import Joi from '@hapi/joi'

import { signup, signin, protect } from './utils/auth'

import { connect } from './utils/db'

import userRouter from './resources/user/user.router'

Joi.objectId = require('joi-objectid')(Joi)

export const app = express()
const server = http.createServer(app)

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/signin', signin)

// auth
app.use('/api', protect)

app.use('/api/user', userRouter)

const start = async () => {
  try {
    await connect()
    server.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}

export { start }
