import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import { createObjectSchema, editObjectSchema } from './review.schema'

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
      required: true,
      refPath: 'itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: ['review', 'cateringestablishment']
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
      getters: true,
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v
      }
    },
    toJSON: {
      getters: true,
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v
      }
    }
  },
  { timestamps: true }
)

function validateCreateObject(cuisine) {
  return Joi.validate(cuisine, createObjectSchema)
}

function validateEditObject(cuisine) {
  return Joi.validate(cuisine, editObjectSchema)
}

function validateEditStatus(cuisine) {
  const schema = Joi.object().keys({
    locked: Joi.boolean(),
    approved: Joi.boolean()
  })
  return Joi.validate(cuisine, schema)
}

reivewSchema.virtual('totalRating').get(function() {
  return (this.foodRating + this.staffRating + this.generalRating) / 3
})

reivewSchema.plugin(mongoosePaginate)

const Review = mongoose.model('review', reivewSchema)

exports.validateCreateObject = validateCreateObject
exports.validateEditObject = validateEditObject
exports.validateEditStatus = validateEditStatus
exports.Review = Review
