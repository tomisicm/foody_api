import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

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

foodSchema.plugin(mongoosePaginate)

exports.foodSchema = foodSchema
exports.Food = mongoose.model('food', foodSchema)
