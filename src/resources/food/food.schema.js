import Joi from '@hapi/joi'
Joi.objectId = require('joi-objectid')(Joi)

export const createObjectSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .max(30)
    .required(),
  /* TODO */
  tag: Joi.string()
    .valid('Popular', 'Spicy', 'Recommended')
    .required(),
  image: Joi.string(),
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
  tag: Joi.string()
    .valid('Popular', 'Spicy', 'Recommended', '')
    .allow('', null),
  image: Joi.string(),
  description: Joi.string()
    .trim()
    .max(55)
    .required(),
  portion: Joi.number().required()
})
