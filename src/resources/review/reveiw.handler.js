const reviewEmitter = require('./review.controller')

reviewEmitter.on('reviewcreated', recalcRating)

/* class ReviewHandler extends EventEmitter {
  recalcRating() {
    console.log('review created')
  }
}
module.exports = ReviewHandler
*/

function recalcRating() {
  console.log(reviewEmitter)
}

module.exports.recalcRating = recalcRating
