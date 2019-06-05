import Joi from '@hapi/joi'
Joi.objectId = require('joi-objectid')(Joi)

export const body = Joi.string()
  .min(5)
  .max(500)
  .required()

export const replyTo = Joi.objectId().allow(null)

export const item = Joi.objectId()
export const itemType = Joi.string()

export const createObjectSchema = Joi.object().keys({
  body: body,
  item: item.required(),
  itemType: itemType.required(),
  replyTo: replyTo
})

export const editObjectSchema = Joi.object().keys({
  body: body
})
