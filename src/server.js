import express from 'express'
import http from 'http'

import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import Joi from '@hapi/joi'

import { authentication } from './utils/auth'

import { connect } from './utils/db'

import authRouter from '../src/utils/auth.router'
import userRouter from './resources/user/user.router'

import CateringRouter from './resources/catering/catering.router'
import CuisineRouter from './resources/food/cuisine.router'
import FoodRouter from './resources/food/food.router'
import ReviewRouter from './resources/review/review.router'
import CommentRouter from './resources/review/comment.router'

Joi.objectId = require('joi-objectid')(Joi)

export const app = express()
const server = http.createServer(app)

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/public', express.static('public'))

app.use('/', authRouter)

app.use('/api', authentication)

app.use('/api/user', userRouter)

app.use('/api/cuisine', CuisineRouter)
app.use('/api/food', FoodRouter)
app.use('/api/catering', CateringRouter)
app.use('/api/review', ReviewRouter)
app.use('/api/comment', CommentRouter)

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
