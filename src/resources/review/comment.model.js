import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      default: null
    },
    replayTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment',
      default: null
    }
  },
  { timestamps: true }
)

commentSchema.plugin(mongoosePaginate)

export const Comment = mongoose.model('comment', commentSchema)
