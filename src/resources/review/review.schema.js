import Joi from '@hapi/joi'
Joi.objectId = require('joi-objectid')(Joi)

export const title = Joi.string()
  .trim()
  .max(50)

export const generalImpression = Joi.string()
  .trim()
  .max(500)
export const generalRating = Joi.number()
  .min(0)
  .max(5)

export const foodSection = Joi.string()
  .trim()
  .max(500)
export const foodRating = Joi.number()
  .min(0)
  .max(5)

export const staffSection = Joi.string()
  .trim()
  .max(500)
export const staffRating = Joi.number()
  .min(0)
  .max(5)

export const item = Joi.objectId()
export const itemType = Joi.string()

export const editObjectSchema = Joi.object().keys({
  title,
  generalImpression,
  generalRating,
  foodSection,
  foodRating,
  staffSection,
  staffRating
})

export const createObjectSchema = Joi.object().keys({
  title: title.required(),
  item: item,
  itemType: itemType,
  generalImpression: generalImpression.required(),
  generalRating: generalRating.required(),
  foodSection: foodSection.required(),
  foodRating: foodRating.required(),
  staffSection: staffSection.required(),
  staffRating: staffRating.required()
})
