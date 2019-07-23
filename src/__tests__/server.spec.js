/* import request from 'supertest'
import { app } from '../server'
import { User } from '../resources/user/user.model'
import { newToken } from '../utils/auth'
import mongoose from 'mongoose'

describe('API Authentication:', () => {
  let token
  beforeEach(async () => {
    const user = await User.create({
      email: 'aaaa@hello.com',
      password: 'hellooooo'
    })
    token = newToken(user)
  })
})
 */
