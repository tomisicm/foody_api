import {
  signinSchema,
  signupSchema
} from '../../src/resources/user/user.schema'

import Joi from '@hapi/joi'

function validateSignin(req, res, next) {
  const { error, value } = Joi.validate(req.body, signinSchema)

  if (error) {
    return res.status(400).send(error)
  }
  req.parsed = value
  return next()
}

function validateSignup(req, res, next) {
  const { error, value } = Joi.validate(req.body, signupSchema)

  if (error) {
    return res.status(400).send(error)
  }
  req.parsed = value
  return next()
}

exports.validateSignin = validateSignin
exports.validateSignup = validateSignup
