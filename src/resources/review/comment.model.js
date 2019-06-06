import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

import { createObjectSchema, editObjectSchema } from './comment.schema'

import Joi from '@hapi/joi'

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
      required: true
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

commentSchema.pre('remove', async function() {
  // console.log(this.replyTo)
  if (this.replyTo == null) {
    const doc = await Comment.deleteMany({ replyTo: this._id })
    console.log(doc)
  }
})

const Comment = mongoose.model('comment', commentSchema)

function validateEditObject(comment) {
  return Joi.validate(comment, editObjectSchema)
}

function validateCreateObject(comment) {
  return Joi.validate(comment, createObjectSchema)
}

exports.validateCreateObject = validateCreateObject
exports.validateEditObject = validateEditObject
exports.Comment = Comment
