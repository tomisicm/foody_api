import Joi from '@hapi/joi'

import { addressShema } from '../../commonSchemas/address.schema'
Joi.objectId = require('joi-objectid')(Joi)

const name = Joi.string()
  .trim()
  .max(50)

export const createObjectSchema = Joi.object().keys({
  name: name.required(),
  address: addressShema,
  contactInformation: Joi.array().items(
    Joi.string().email(),
    Joi.string().regex(
      // eslint-disable-next-line no-useless-escape
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      { name: 'phone number' }
    )
  ),
  website: Joi.string().allow(null),
  cuisine: Joi.array().items(Joi.objectId()),
  michelinStars: Joi.number(),
  owner: Joi.objectId(),
  pageMaintainedBy: Joi.array()
    .items(
      Joi.objectId()
        .required()
        .min(1)
    )
    .required(),
  images: Joi.array().items(Joi.string().min(1))
})

export const editObjectSchema = Joi.object().keys({})
