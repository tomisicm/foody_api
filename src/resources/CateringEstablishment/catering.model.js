import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import Joi from '@hapi/joi'

import { createObjectSchema } from './catering.schema'

const cateringEstablishmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    address: {
      type: Object,
      default: null
    },
    contactInformation: {
      type: Array,
      required: true
    },
    website: {
      type: String,
      default: null
    },
    cuisine: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'cuisine',
        default: null
      }
    ],
    michelinStars: {
      type: Number,
      default: 0
    },
    images: [],
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      default: null
    },
    pageMaintainedBy: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      }
    ]
  },
  {
    toObject: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v
      }
    },
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v
      }
    }
  },
  { timestamps: true }
)

cateringEstablishmentSchema.virtual('fullAddress').get(function() {
  return (
    this.address.street +
    ', ' +
    this.address.streetNo +
    ', ' +
    this.address.city
  )
})

function validateCreateObject(catering) {
  return Joi.validate(catering, createObjectSchema)
}

cateringEstablishmentSchema.plugin(mongoosePaginate)

const CateringEstablishment = mongoose.model(
  'cateringestablishment',
  cateringEstablishmentSchema
)

exports.validateCreateObject = validateCreateObject
exports.CateringEstablishment = CateringEstablishment
