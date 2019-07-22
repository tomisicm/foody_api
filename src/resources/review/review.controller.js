import _ from 'lodash'
// import { findDocumentByModelAndId } from '../../middleware/item.middleware'
import { findDocumentByCollectionAndId } from '../../middleware/item.middleware'

import { Review } from './review.model'

import { reviewHandler } from './reveiw.emitter'
import { recalculate } from './review.handler'

// imported recalculate which registereed event
recalculate()

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
      { $project: { likedBy: 0 } },
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
  const user = req.user._id ? req.user._id : null

  const { perPage, page } = req.query

  const options = {
    populate: {
      path: 'createdBy',
      select: '_id name profile'
    },
    sort: { avgRating: -1 },
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10,
    lean: true
  }

  try {
    let doc = await Review.paginate({ item: req.params.itemId }, options)

    doc.docs.forEach(record => determineLikes(user, record))

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getReviewById = async (req, res) => {
  const user = req.user._id ? req.user._id : null

  try {
    const doc = await Review.findById(req.params.id)
      .populate([
        {
          path: 'createdBy',
          select: '_id name profile'
        },
        {
          path: 'item'
        }
      ])
      .lean()

    determineLikes(user, doc)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// TODO: middleware where i will check if item is valid, exists
export const createReview = async (req, res) => {
  const createdBy = req.user._id

  const value = req.parsed

  try {
    findDocumentByCollectionAndId(value.item, value.itemType)

    const avgRating = calculateAvgRating(value)

    const doc = await Review.create({
      ...value,
      createdBy,
      avgRating
    })

    await doc.populate('createdBy').execPopulate()

    reviewHandler.emit('updateCateringRating', doc)

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

// review approval is one way operation. this cannot be undone
// TODO: research pre save hook, it might be better to do approval logic inside hook
export const editReviewStatus = async (req, res) => {
  const value = req.parsed

  // only admins can change status.
  // TODO: might be better in separate middleware
  if (!req.user.admin)
    return res
      .status(400)
      .send({ error: { message: 'You do not have admin permissions' } })

  try {
    const doc = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: { locked: value.locked }
      },
      { new: true }
    )

    // doc approved is reference
    if (!doc.approved && value.approved === true) {
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
  const value = req.parsed

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

    // the logic here could be improved, but for now i'll
    // assume that front is providing all grades
    const avgRating = calculateAvgRating(req.body)

    const updatedDoc = await Review.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      { ...value, avgRating },
      { new: true }
    )
      .lean()
      .exec()

    reviewHandler.emit('updateCateringRating', updatedDoc)

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// when user not logged, no req.user._id
// can be generalized with collection reference
export const likesReview = async (req, res) => {
  const user = req.user._id ? req.user._id : null

  try {
    const doc = await Review.findById(req.params.id)

    let data = {
      reviewId: req.params.id
    }

    if (user) {
      data.liked = doc.likedBy.includes(user)
    }

    data.likes = doc.likedBy.length

    res.status(200).json({ data: data })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

function calculateAvgRating(body) {
  return (
    [body.generalRating, body.foodRating, body.staffRating].reduce(
      (p, c) => p + c,
      0
    ) / (3).toFixed(1)
  )
}

// Accepts plane JS docs
function determineLikes(user, doc) {
  const data = {}

  const { likedBy } = doc

  data.likes = likedBy.length

  if (likedBy.indexOf(user) > -1) {
    data.liked = true
  }

  doc.likedBy = Object.assign({}, data)
}

export default {
  searchForReviews,
  getReviews,
  getReviewsByItemId,
  getReviewById,
  createReview,
  editReview,
  editReviewStatus,
  likesReview
}
