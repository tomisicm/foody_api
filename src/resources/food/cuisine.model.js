import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import MODEL from '../models'

import Joi from '@hapi/joi'

const cuisineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      maxlength: 50
    },
    origin: [
      {
        type: String,
        default: null,
        trim: true
      }
    ],
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: MODEL.USER,
      required: true
    },
    // this field will only be changable by admins
    approved: {
      default: null,
      type: mongoose.SchemaTypes.ObjectId,
      ref: MODEL.USER
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

function validateObject(cuisine) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(50)
      .required(),
    origin: Joi.array()
  })
  return Joi.validate(cuisine, schema)
}

cuisineSchema.plugin(mongoosePaginate)

exports.cuisineSchema = cuisineSchema
exports.validateObject = validateObject
exports.Cuisine = mongoose.model(MODEL.CUISINE, cuisineSchema)
