import Joi from '@hapi/joi'
Joi.objectId = require('joi-objectid')(Joi)

export const createObjectSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .max(30)
    .required(),
  tag: Joi.any()
    .valid('Popular', 'Spicy', 'Recommended', null)
    .required(),
  image: Joi.string().allow(null),
  description: Joi.string()
    .trim()
    .max(255)
    .required(),
  portion: Joi.number().required(),
  price: Joi.number().required(),
  catering: Joi.objectId().required()
})

export const editObjectSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .max(30)
    .required(),
  tag: Joi.any()
    .valid('Popular', 'Spicy', 'Recommended', null)
    .required(),
  image: Joi.string().allow(null),
  description: Joi.string()
    .trim()
    .max(255)
    .required(),
  portion: Joi.number().required(),
  price: Joi.number().required()
})
