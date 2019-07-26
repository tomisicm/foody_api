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

  // can be extracted as separate service
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

  // only admins can change status
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

      // doc approved is reference
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
