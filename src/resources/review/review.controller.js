import _ from 'lodash'

import {
  Review,
  validateEditStatus,
  validateCreateObject,
  validateEditObject
} from './review.model'

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
      select: '_id name profile'
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
    const doc = await Review.findById(req.params.id).populate([
      {
        path: 'createdBy',
        select: '_id name profile'
      },
      {
        path: 'item'
      }
    ])
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

  const avgRating = calculateAvgRating(req.body)

  const createdBy = req.user._id
  try {
    const doc = await Review.create({
      ...req.body,
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
  const { error } = validateEditStatus(req.body)
  if (error) return res.status(400).send(error)

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
        $set: { locked: req.body.locked }
      },
      { new: true }
    )

    if (!doc.approved && req.body.approved === true) {
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

  // TODO: replace req.body with value
  // const { value } = validateEditObject(req.body)

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

    const avgRating = calculateAvgRating(req.body)

    const updatedDoc = await Review.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      { ...req.body, avgRating },
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

// TODO: remove likedBy property from review object
export const likeReview = async (req, res) => {
  const userLiked = req.user._id

  try {
    const doc = await Review.findById(req.params.id)

    if (!doc.likedBy.includes(userLiked)) {
      doc.likedBy.push(userLiked)
    } else {
      const index = doc.likedBy.indexOf(userLiked)
      if (index > -1) {
        doc.likedBy.splice(index, 1)
      }
    }
    await doc.save()

    res.status(200).json({ data: doc })
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

export default {
  searchForReviews,
  getReviews,
  getReviewsByItemId,
  getReviewById,
  createReview,
  editReview,
  editReviewStatus,
  likeReview,
  likesReview
}
