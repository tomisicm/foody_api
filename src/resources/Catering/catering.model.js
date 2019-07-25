import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import { cuisineSchema } from '../food/cuisine.model'

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
    cuisine: [cuisineSchema],
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
    rating: {
      type: Number,
      default: 5
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

cateringEstablishmentSchema.methods.canMaintainCatering = function(userId) {
  return this.pageMaintainedBy.includes(userId)
}

cateringEstablishmentSchema.virtual('fullAddress').get(function() {
  return (
    this.address.street +
    ', ' +
    this.address.streetNo +
    ', ' +
    this.address.city
  )
})

cateringEstablishmentSchema.plugin(mongoosePaginate)

const CateringEstablishment = mongoose.model(
  'cateringestablishment',
  cateringEstablishmentSchema
)

exports.CateringEstablishment = CateringEstablishment
