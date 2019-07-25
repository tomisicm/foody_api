import Joi from '@hapi/joi'

import { addressShema } from '../../commonSchemas/address.schema'

Joi.objectId = require('joi-objectid')(Joi)

const name = Joi.string()
  .trim()
  .max(50)

const contactInformation = Joi.array().items(
  Joi.string().email(),
  Joi.string().regex(
    // eslint-disable-next-line no-useless-escape
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    { name: 'phone number' }
  )
)

const cuisine = Joi.array()
const website = Joi.string().allow('')
const michelinStars = Joi.number().default(0)
const pageMaintainedBy = Joi.array().items(Joi.objectId())
const images = Joi.array().items(Joi.string())

export const createObjectSchema = Joi.object().keys({
  name: name.required(),
  address: addressShema,
  contactInformation: contactInformation,
  website: website,
  cuisine: cuisine,
  michelinStars: michelinStars,
  // owner: Joi.objectId(),
  pageMaintainedBy: pageMaintainedBy,
  images: images
})

export const editObjectSchema = Joi.object().keys({
  name: name,
  address: addressShema,
  contactInformation: contactInformation,
  website: website,
  cuisine: cuisine,
  michelinStars: michelinStars,
  /* owner: Joi.objectId(), */
  pageMaintainedBy: pageMaintainedBy,
  images: images
})
