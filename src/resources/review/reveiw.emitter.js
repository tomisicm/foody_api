import EventEmitter from 'events'

class ReviewHandler extends EventEmitter {}

const reviewHandler = new ReviewHandler()

/* function recalcRating() {
  console.log(reviewHandler)
} */

exports.reviewHandler = reviewHandler
// exports.recalcRating = recalcRating
