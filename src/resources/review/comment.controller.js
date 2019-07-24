import { Comment } from './comment.model'
import commentService from './commentingService'

const getCommentsByItemId = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    populate: [
      {
        path: 'createdBy',
        select: '_id name'
      },
      { path: 'replyTo' },
      {
        path: 'thread',
        populate: [
          {
            path: 'createdBy',
            select: '_id name'
          }
        ]
      }
    ],
    sort: '-createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10,
    lean: true
  }
  try {
    const docs = await Comment.paginate(
      { item: req.params.itemId, replyTo: null },
      options
    )
    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

const createComment = async (req, res) => {
  const value = req.parsed

  const createdBy = req.user._id

  try {
    const doc = await commentService.createComment(value, createdBy)

    res.status(201).json({ data: doc })
  } catch (e) {
    // all this fucking errors should be thrown in global error handler and dealt with there
    console.error(e)
    res.status(400).send(e)
  }
}

const editComment = async (req, res) => {
  const value = req.parsed

  try {
    const updatedDoc = await commentService.editComment(
      req.params.id,
      value,
      req.user._id
    )

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
}

export const deleteComment = async (req, res) => {
  try {
    const removedDoc = await commentService.deleteComment(
      req.params.id,
      req.user._id
    )

    res.status(200).json({ data: removedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  getCommentsByItemId,
  createComment,
  editComment,
  deleteComment
}
