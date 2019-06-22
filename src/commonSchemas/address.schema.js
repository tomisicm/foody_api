import Joi from '@hapi/joi'
Joi.objectId = require('joi-objectid')(Joi)

export const city = Joi.string()
  .trim()
  .max(50)

export const street = Joi.string()
  .trim()
  .max(50)

export const streetNo = Joi.number()

export const addressShema = Joi.object().keys({
  city: city,
  street: street,
  streetNo: streetNo
})
