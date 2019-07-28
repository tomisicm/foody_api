import { Comment } from './comment.model'
import { DocumentService } from '../documentService'

class CommentService extends DocumentService {
  getCommentById() {
    return null
  }

  async createComment(comment, createdBy) {
    try {
      const cateringestablishment = await this.findDocumentByCollectionAndId(
        comment.item,
        'cateringestablishment'
      )

      if (!cateringestablishment) {
        throw new Error('cateringestablishment does not exist')
      }

      // check if replay
      if (comment.replyTo) {
        const reply = await this.findDocumentByCollectionAndId(
          comment.replyTo,
          'comment'
        )
        if (!reply) {
          throw new Error('reply does not exist')
        }
      }

      const doc = await Comment.create({ ...comment, createdBy })

      await doc
        .populate({ path: 'createdBy', select: '_id name' })
        .execPopulate()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async editComment(commentId, comment, userId) {
    try {
      const updatedDoc = await Comment.findOneAndUpdate(
        {
          createdBy: userId,
          _id: commentId
        },
        comment,
        { new: true }
      )
        .lean()
        .exec()
      if (!updatedDoc) {
        throw new Error('comment does not exist')
      }

      return updatedDoc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const doc = await Comment.findById({
        _id: commentId,
        createdBy: userId
      })

      if (!doc) {
        throw new Error('comment does not exist')
      }

      await doc.remove()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

const commentService = new CommentService()

export default commentService
