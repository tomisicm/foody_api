import _ from 'lodash'

import {
  Review,
  validateEditStatus,
  validateCreateObject,
  validateEditObject
} from './review.model'

export const getReviews = async (req, res) => {
  const { perPage, page, sort = '-updatedAt' } = req.query

  const options = {
    populate: [
      {
        path: 'createdBy',
        select: '_id name'
      },
      {
        path: 'item'
      }
    ],
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

export const searchForReviews = async (req, res) => {
  let { page = 1, perPage = 10 } = req.query
  const { review, catering } = req.body

  // deal with this later
  page = parseInt(page, 10)
  perPage = parseInt(perPage, 10)

  let match = {}

  if (!_.isEmpty(review.title)) {
    match = {
      ...match,
      title: { $regex: review.title, $options: 'i' }
    }
  }
  if (!_.isEmpty(review.author)) {
    match = {
      ...match,
      'author.name': {
        $regex: review.author,
        $options: 'i'
      }
    }
  }
  // approved is true only for non-approved docs else it is falsy
  if (review.approved) {
    match = {
      ...match,
      approved: null
    }
  }
  if (!_.isEmpty(catering.name)) {
    match = {
      ...match,
      'catering.name': { $regex: catering.name, $options: 'i' }
    }
  }
  if (!_.isEmpty(catering.address && catering.address.city)) {
    match = {
      ...match,
      'catering.address.city': { $regex: catering.address.city, $options: 'i' }
    }
  }
  if (!_.isEmpty(catering.address && catering.address.street)) {
    match = {
      ...match,
      'catering.address.street': {
        $regex: catering.address.street,
        $options: 'i'
      }
    }
  }
  if (!_.isEmpty(catering.cuisine)) {
    match = {
      ...match,
      'catering.cuisine.name': {
        $regex: catering.cuisine.toString(),
        $options: 'i'
      }
    }
  }
  if (!_.isEmpty(catering.michelinStars)) {
    match = {
      ...match,
      'catering.michelinStars': { $gt: 0 }
    }
  }

  console.log(match)
  try {
    let doc = await Review.aggregate([
      {
        $lookup: {
          from: 'cateringestablishments',
          localField: 'item',
          foreignField: '_id',
          as: 'catering'
        }
      },
      { $unwind: '$catering' },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $project: { 'author.password': 0 } },
      { $unwind: '$author' },
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          docs: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          docs: {
            $slice: ['$docs', (page - 1) * perPage, perPage]
          },
          total: 1
        }
      },
      { $project: { _id: 0 } }
    ])

    res.status(200).json({ data: doc[0] || { docs: [], total: 0 } })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const getReviewsByItemId = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    populate: {
      path: 'createdBy',
      select: '_id name'
    },
    sort: { avgRating: -1 },
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
    const doc = await Review.findById(req.params.id).populate({
      path: 'createdBy',
      select: '_id name'
    })
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

  // TODO: update route is missing this logic
  const avgRating = (
    [req.body.generalRating, req.body.foodRating, req.body.staffRating].reduce(
      (p, c) => p + c,
      0
    ) / 3
  ).toFixed(1)

  const createdBy = req.user._id
  try {
    const doc = await Review.create({
      ...req.body,
      createdBy,
      avgRating
    })

    await doc.populate('createdBy').execPopulate()
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
  searchForReviews,
  getReviews,
  getReviewsByItemId,
  getReviewById,
  createReview,
  editReview,
  editReviewStatus
}
