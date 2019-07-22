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
      required: true,
      refPath: 'itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: ['review', 'cateringestablishment']
    },
    replyTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment',
      default: null
    },
    thread: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'comment',
        default: null
      }
    ]
  },
  { timestamps: true }
)

commentSchema.plugin(mongoosePaginate)

// when comment is deleted, the whole thread is deleted
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

const Comment = mongoose.model('comment', commentSchema)

exports.Comment = Comment
