import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import { createObjectSchema, editObjectSchema } from '../food/food.schema'

import Joi from '@hapi/joi'

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    /* TODO */
    tag: {
      type: String,
      enum: ['Popular', 'Spicy', 'Recommended', null]
    },
    image: {
      type: String,
      default: null
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255
    },
    portion: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    catering: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'cateringestablishment',
      required: true
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true },
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
  }
)

function validateCreateObject(food) {
  return Joi.validate(food, createObjectSchema, { stripUnknown: true })
}

function validateEditObject(food) {
  return Joi.validate(food, editObjectSchema, { stripUnknown: true })
}

foodSchema.plugin(mongoosePaginate)

exports.foodSchema = foodSchema
exports.validateCreateObject = validateCreateObject
exports.validateEditObject = validateEditObject
exports.Food = mongoose.model('food', foodSchema)
