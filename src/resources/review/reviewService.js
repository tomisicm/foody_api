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

      const avgRating = calculateAvgRating(review)

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

  async editReview() {}
}

function calculateAvgRating(body) {
  return (
    [body.generalRating, body.foodRating, body.staffRating].reduce(
      (p, c) => p + c,
      0
    ) / (3).toFixed(1)
  )
}

const reviewService = new ReviewService()

export default reviewService
