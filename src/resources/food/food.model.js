import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import Joi from '@hapi/joi'

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    tag: {
      type: String,
      enum: ['Popular', 'Spicy', 'Recommended']
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    image: {
      type: String,
      default: null
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 55
    },
    portion: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
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

function validateObject(food) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(30)
      .required(),
    tag: Joi.string().valid('Popular', 'Spicy', 'Recommended'),
    image: Joi.string(),
    description: Joi.string()
      .trim()
      .max(55)
      .required(),
    portion: Joi.number().required(),
    price: Joi.number().required()
  })
  return Joi.validate(food, schema)
}

foodSchema.plugin(mongoosePaginate)

exports.foodSchema = foodSchema
exports.validateObject = validateObject
exports.Food = mongoose.model('food', foodSchema)
