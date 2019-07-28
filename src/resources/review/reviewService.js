import _ from 'lodash'

import { Review } from './review.model'
import { DocumentService } from '../documentService'

import { reviewNotifier } from './reveiw.emitter'
import { recalculate } from './review.handler'

class ReviewService extends DocumentService {
  constructor() {
    super()
    this.recalculate = recalculate()
  }

  async createReview(review, createdBy) {
    try {
      // check if cateringestablishment exists
      const cateringestablishment = await this.findDocumentByCollectionAndId(
        review.item,
        'cateringestablishment'
      )

      if (!cateringestablishment) {
        throw new Error('cateringestablishment does not exist')
      }

      const avgRating = reviewAvgRating(review)

      const doc = await Review.create({
        ...review,
        createdBy,
        avgRating
      })

      await doc.populate('createdBy').execPopulate()

      reviewNotifier.emit('updateCateringRating', doc)

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async editReview(reviewId, review, userId) {
    try {
      let doc = await Review.findOne({
        _id: reviewId,
        createdBy: userId
      })

      if (!doc) {
        throw new Error('review does not exist')
      }

      if (doc.locked) {
        throw new Error('Review is locked and thus cannot be edited!')
      }

      const avgRating = reviewAvgRating(review)

      doc = Object.assign(doc, { ...review, avgRating, approved: null })

      doc = await doc.save()

      reviewNotifier.emit('updateCateringRating', doc)

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  // TODO: i do not have to return whole doc only the liked status
  async likeReview(reviewId, user) {
    try {
      const doc = await Review.findById(reviewId)

      if (!doc) {
        throw new Error('review does not exist')
      }

      if (!doc.likedBy.includes(user)) {
        doc.likedBy.push(user)
      } else {
        const index = doc.likedBy.indexOf(user)
        if (index > -1) {
          doc.likedBy.splice(index, 1)
        }
      }

      console.log(await doc.determineLikes(user))
      await doc.save()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async editReviewStatus(reviewId, reviewStatus, user) {
    if (!user.admin) {
      throw new Error('You do not have admin permissions')
    }

    try {
      const doc = await Review.findByIdAndUpdate(
        reviewId,
        {
          $set: { locked: reviewStatus.locked }
        },
        { new: true }
      )

      if (!doc.approved && reviewStatus.approved === true) {
        doc.approved = user._id
        await doc.save()
      }

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async getReviewsByItemId(user, perPage, page, itemId) {
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

    const query = { item: itemId }

    // admins see everything
    if (!(user || {}).admin) {
      query.approved = { $ne: null }
    }

    try {
      let collection = await Review.paginate(query, options)

      collection.docs.forEach(record =>
        determineLikes((user || {})._id, record)
      )

      return collection
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async searchForReviews(user, query, review, catering) {
    let { page = 1, perPage = 10 } = query
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
        'catering.address.city': {
          $regex: catering.address.city,
          $options: 'i'
        }
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

      return { data: doc[0] || { docs: [], total: 0 } }
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

function reviewAvgRating(review) {
  return (
    [review.generalRating, review.foodRating, review.staffRating].reduce(
      (p, c) => p + c,
      0
    ) / (3).toFixed(1)
  )
}

function determineLikes(user, doc) {
  const data = {}

  const { likedBy } = doc

  data.likes = likedBy.length

  if (likedBy.indexOf(user) > -1) {
    data.liked = true
  }

  doc.likedBy = Object.assign({}, data)
}

const reviewService = new ReviewService()

export default reviewService
