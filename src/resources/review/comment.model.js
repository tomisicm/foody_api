import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import MODEL from '../models'

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
      ref: MODEL.USER,
      required: true
    },
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      refPath: 'itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: [MODEL.REVIEW, MODEL.CATERING]
    },
    replyTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: MODEL.COMMENT,
      default: null
    },
    thread: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: MODEL.COMMENT,
        default: null
      }
    ]
  },
  { timestamps: true }
)

commentSchema.plugin(mongoosePaginate)

commentSchema.pre('remove', async function() {
  if (this.replyTo == null) {
    await Comment.deleteMany({ replyTo: this._id })
  }
})

commentSchema.post('save', async function() {
  if (this.replyTo) {
    await Comment.findByIdAndUpdate(
      this.replyTo,
      {
        $push: {
          thread: {
            $each: [this],
            $position: 0
          }
        }
      },
      { safe: true, upsert: true }
    )
  }
})

const Comment = mongoose.model(MODEL.COMMENT, commentSchema)

exports.Comment = Comment
