import { Review } from './review.model'
import { DocumentService } from '../documentService'

// rename reviewEmitter
import { reviewHandler } from './reveiw.emitter'
import { recalculate } from './review.handler'

recalculate()

class ReviewService extends DocumentService {
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

      reviewHandler.emit('updateCateringRating', doc)

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

      doc = Object.assign(doc, { ...review, avgRating })

      doc = await doc.save()

      reviewHandler.emit('updateCateringRating', doc)

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  // can be extracted as separate service
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

      await doc.save()

      return doc
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

const reviewService = new ReviewService()

export default reviewService
