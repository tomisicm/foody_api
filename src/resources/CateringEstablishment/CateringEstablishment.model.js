import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import Joi from '@hapi/joi'

const cateringEstablishmentSchema = new mongoose.Schema(
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
  return this.address.street + ', ' + this.address.streetNo + ', ' + this.city
})

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

function validateObject(catering) {
  const schema = {
    name: Joi.string()
      .trim()
      .max(50)
      .required(),
    address: addressShema,
    foodType: [Joi.string()],
    openingYear: Joi.date()
  }
  return Joi.validate(catering, schema)
}

cateringEstablishmentSchema.plugin(mongoosePaginate)

const CateringEstablishment = mongoose.model(
  'cateringestablishment',
  cateringEstablishmentSchema
)

exports.validateObject = validateObject
exports.CateringEstablishment = CateringEstablishment
