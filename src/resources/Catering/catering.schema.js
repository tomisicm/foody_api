import Joi from '@hapi/joi'

import { addressShema } from '../../commonSchemas/address.schema'
Joi.objectId = require('joi-objectid')(Joi)

const name = Joi.string()
  .trim()
  .max(50)

// TODO: refactor common fields
export const createObjectSchema = Joi.object()
  .options({ stripUnknown: true })
  .keys({
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
    website: Joi.string().allow(''),
    cuisine: Joi.array(),
    michelinStars: Joi.number().default(0),
    // owner: Joi.objectId(),
    pageMaintainedBy: Joi.array().items(Joi.objectId()),
    images: Joi.array().items(Joi.string())
  })

export const editObjectSchema = Joi.object()
  .options({ stripUnknown: true })
  .keys({
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
    website: Joi.string().allow(''),
    cuisine: Joi.array(),
    michelinStars: Joi.number().default(0),
    /* owner: Joi.objectId(), */
    pageMaintainedBy: Joi.array().items(Joi.objectId()),
    images: Joi.array().items(Joi.string())
  })
