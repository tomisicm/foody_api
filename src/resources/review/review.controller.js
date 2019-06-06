import {
  Review,
  validateEditStatus,
  validateCreateObject,
  validateEditObject
} from './review.model'

export const getReviews = async (req, res) => {
  const { perPage, page, sort = '-updatedAt' } = req.query

  const options = {
    populate: {
      path: 'createdBy',
      select: '_id name'
    },
    sort: sort,
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await Review.paginate({}, options)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getReviewsByItemId = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    populate: {
      path: 'createdBy',
      select: '_id name'
    },
    sort: '-createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await Review.paginate({ item: req.params.itemId }, options)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getReviewById = async (req, res) => {
  try {
    const doc = await Review.findById(req.params.id)
    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// TODO: middleware where i will check if item is valid, exists
export const createReview = async (req, res) => {
  const { error } = validateCreateObject(req.body)
  if (error) return res.status(400).send(error)

  const createdBy = req.user._id
  try {
    const doc = await Review.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

// review approval is one way operation. this cannot be undone
// TODO: research pre save hook, it might be better to do approval logic inside hook
export const editReviewStatus = async (req, res) => {
  const { error } = validateEditStatus(req.body)
  if (error) return res.status(400).send(error)

  // only admins can change status.
  // TODO: might be better in separate middleware
  if (!req.user.admin)
    return res
      .status(400)
      .send({ message: 'You do not have admin permissions' })

  try {
    const doc = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: { locked: req.body.locked }
      },
      { new: true }
    )

    if (doc.approved == null && req.body.approved === true) {
      doc.approved = req.user._id
      await doc.save()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// review content can only be updated by its creator
export const editReview = async (req, res) => {
  const { error } = validateEditObject(req.body)
  if (error) return res.status(400).send(error)

  try {
    let doc = await Review.findById({
      _id: req.params.id
    })

    if (!doc) {
      return res.status(400).send({ message: 'Review not found!' })
    }

    if (doc.locked)
      return res
        .status(400)
        .send({ message: 'Review is locked and thus cannot be edited!' })

    const updatedDoc = await Review.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec()

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  getReviews,
  getReviewsByItemId,
  getReviewById,
  createReview,
  editReview,
  editReviewStatus
}
