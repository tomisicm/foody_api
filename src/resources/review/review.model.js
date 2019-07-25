import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

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
      enum: ['cateringestablishment']
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
    avgRating: {
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
    },
    likedBy: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
      }
    ]
  },
  { timestamps: true },
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
  }
)

reivewSchema.methods.determineLikes = function(userId) {
  const data = {}

  const { likedBy } = this

  data.likes = likedBy.length

  if (likedBy.indexOf(userId) > -1) {
    data.liked = true
  }

  return data
}

reivewSchema.plugin(mongoosePaginate)

const Review = mongoose.model('review', reivewSchema)

exports.Review = Review
