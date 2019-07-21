import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { newToken, verifyToken, signup, signin, authorization } from '../auth'
import config from '../../config'
import { User } from '../../resources/user/user.model'

describe('Authentication:', () => {
  describe('newToken', () => {
    test('Given user, When Creates new jwt from user, Then new token is created.', () => {
      const id = 123
      const token = newToken({ id })
      const user = jwt.verify(token, config.secrets.jwt)

      expect(user.id).toBe(id)
    })
  })

  describe('verifyToken', () => {
    test('Given token, When validating jwt, Then verifyToken returns payload', async () => {
      const id = 1234
      const token = jwt.sign({ id }, config.secrets.jwt)
      const user = await verifyToken(token)
      expect(user.id).toBe(id)
    })
  })

  describe('signup', () => {
    test('requires Name, Email and Password', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signup(req, res)
    })

    test('Given valid data, When user is created, Then new token is sent', async () => {
      expect.assertions(2)

      const req = {
        body: {
          name: 'randomstr',
          email: 'randomstr@gmail.com',
          password: 'agfddsadjsssh'
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          let user = await verifyToken(result.token)
          user = await User.findById(user.id)
            .lean()
            .exec()
          expect(user.email).toBe(req.body.email)
        }
      }

      await signup(req, res)
    })
  })

  describe('signin', () => {
    test('Requires Email and Password', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result).toBeTruthy()
        }
      }

      await signin(req, res)
    })

    test('Non existing user cannot sign in', async () => {
      expect.assertions(2)

      const req = { body: { email: 'hello@gmail.com', password: '2931jssh' } }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res)
    })

    test('Existing user signs in with wrong password, he get 401', async () => {
      expect.assertions(2)

      await User.create({
        name: 'djokaaaa',
        email: 'hello@me.com',
        password: 'yoyoyoyoyo'
      })

      const req = {
        body: {
          email: 'hello@me.com',
          password: 'wrongpassword'
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res)
    })

    test('When sign in is sucessful, then token is created returned', async () => {
      expect.assertions(2)
      const fields = {
        name: 'aesfgdggdfg',
        email: 'hellosfdg@gmail.com',
        password: 'yoy432oyo'
      }
      const savedUser = await User.create(fields)

      const req = {
        body: { email: 'hellosfdg@gmail.com', password: 'yoy432oyo' }
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          let user = await verifyToken(result.token)
          user = await User.findById(user.id)
            .lean()
            .exec()
          expect(user._id.toString()).toBe(savedUser._id.toString())
        }
      }

      await signin(req, res)
    })
  })

  describe('authorization', () => {
    test('Header must contain Bearer token', async () => {
      expect.assertions(2)

      const req = { headers: {} }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await authorization(req, res)
    })

    test('Token must have correct Bearer prefix', async () => {
      expect.assertions(2)

      let req = { headers: { authorization: newToken({ id: '123sfkj' }) } }
      let res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await authorization(req, res)
    })

    test('For the given token, user must be exist.', async () => {
      const token = `Bearer ${newToken({ id: mongoose.Types.ObjectId() })}`
      const req = { headers: { authorization: token } }

      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await authorization(req, res)
    })

    test('finds user form token and passes on', async () => {
      const user = await User.create({
        name: 'adfsgbgdefsv',
        email: 'hello@hello.com',
        password: '12343245'
      })
      const token = `Bearer ${newToken(user)}`
      const req = { headers: { authorization: token } }

      const next = () => {}
      await authorization(req, {}, next)
      expect(req.user._id.toString()).toBe(user._id.toString())
      expect(req.user).not.toHaveProperty('password')
    })
  })
})
