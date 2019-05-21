import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import Joi from '@hapi/joi'

const objectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      trim: true,
      maxlength: 50
    },
    address: {
      type: Object,
      default: null
    }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        delete ret.__v
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        delete ret.__v
      }
    }
  },
  { timestamps: true }
)

const addressShema = Joi.object().keys({
  city: Joi.string()
    .trim()
    .max(50)
    .required(),
  street: Joi.string()
    .trim()
    .max(50),
  streetNo: Joi.string()
    .trim()
    .max(50)
})

function validateObject(object) {
  const schema = {
    name: Joi.string()
      .trim()
      .max(50)
      .required(),
    address: addressShema,
    foodType: [Joi.string()],
    openingYear: Joi.date()
  }
  return Joi.validate(object, schema)
}

objectSchema.plugin(mongoosePaginate)

exports.validateObject = validateObject
exports.Object = mongoose.model('object', objectSchema)
