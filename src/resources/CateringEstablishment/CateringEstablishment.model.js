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
    // IF OWNER IS NOT SPECIFIED I HAVE TO MAINTAIN THE PAGE
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
