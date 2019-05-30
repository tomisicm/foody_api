import { Comment } from './comment.model'

const getCommentsByItemId = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    populate: {
      path: 'createdBy',
      select: '_id name'
    },
    sort: '-createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10,
    lean: true
  }
  try {
    const docs = await Comment.paginate({ item: req.params.itemId }, options)
    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

const createComment = async (req, res) => {
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
  try {
    /* const updatedDoc = await Comment.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec() */
    console.log(req)

    /* if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc }) */
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default { getCommentsByItemId, createComment, editComment }
