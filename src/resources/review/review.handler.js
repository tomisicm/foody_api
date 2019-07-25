import { reviewNotifier } from './reveiw.emitter'

import { Review } from './review.model'
import { CateringEstablishment } from './../catering/catering.model'

const recalculate = function() {
  reviewNotifier.on('updateCateringRating', async function(data) {
    // ?might be static fucntion
    let rating = await Review.aggregate([
      {
        $match: {
          item: data.item
        }
      },
      {
        $group: {
          _id: null,
          rating: {
            $avg: '$avgRating'
          }
        }
      },
      { $project: { _id: 0 } }
    ])

    await CateringEstablishment.findByIdAndUpdate(data.item, rating[0])
  })
}

exports.recalculate = recalculate
