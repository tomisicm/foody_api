import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import Joi from '@hapi/joi'

const reivewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50
    },
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    generalImpression: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500
    },
    generalRating: {
      type: Number,
      min: 0,
      max: 5
    },
    foodSection: {
      type: String,
      trim: true,
      default: null,
      maxlength: 500
    },
    foodRating: {
      type: Number,
      min: 0,
      max: 5
    },
    staffSection: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500
    },
    staffRating: {
      type: Number,
      min: 0,
      max: 5
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    // this field will only be changable by admins
    approved: {
      default: null,
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user'
    },
    // this field will only be changable by admins
    locked: {
      type: Boolean,
      default: false
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
    title: Joi.string()
      .trim()
      .required()
      .max(50),
    generalImpression: Joi.string()
      .trim()
      .required()
      .max(500),
    foodSection: Joi.string()
  })
  return Joi.validate(cuisine, schema)
}

function validateEditStatus(cuisine) {
  const schema = Joi.object().keys({
    locked: Joi.boolean(),
    approved: Joi.boolean()
  })
  return Joi.validate(cuisine, schema)
}

reivewSchema.plugin(mongoosePaginate)

exports.validateObject = validateObject
exports.validateEditStatus = validateEditStatus
exports.Review = mongoose.model('review', reivewSchema)
