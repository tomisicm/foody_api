import {
  Comment,
  validateEditObject,
  validateCreateObject
} from './comment.model'

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
  const { error } = validateCreateObject(req.body)
  if (error) return res.status(400).send(error)

  const createdBy = req.user._id

  try {
    const doc = await Comment.create({ ...req.body, createdBy })

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

const editComment = async (req, res) => {
  const { error } = validateEditObject(req.body)
  if (error) return res.status(400).send(error)

  try {
    const updatedDoc = await Comment.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec()
    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const deleteComment = async (req, res) => {
  try {
    const doc = await Comment.findById({
      _id: req.params.id
    })

    if (!doc) {
      return res.status(400).end()
    }

    await doc.remove()

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  getCommentsByItemId,
  createComment,
  editComment,
  deleteComment
}
