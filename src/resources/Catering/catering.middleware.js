import { createObjectSchema, editObjectSchema } from './catering.schema'

import Joi from '@hapi/joi'

function validateCreateObject(req, res, next) {
  const { error, value } = Joi.validate(req.body, createObjectSchema, {
    stripUnknown: true
  })

  if (error) {
    return res.status(400).send(error)
  }
  req.parsed = value
  return next()
}

function validateEditObject(req, res, next) {
  const { error, value } = Joi.validate(req.body, editObjectSchema, {
    stripUnknown: true
  })

  if (error) {
    return res.status(400).send(error)
  }
  req.parsed = value
  return next()
}

exports.validateCreateObject = validateCreateObject
exports.validateEditObject = validateEditObject
