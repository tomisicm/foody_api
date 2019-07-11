import { reviewHandler } from './reveiw.emitter'

// import mongoose from 'mongoose'

import { Review } from './review.model'
import { CateringEstablishment } from './../CateringEstablishment/catering.model'

const recalculate = function() {
  reviewHandler.on('dick', async function(data) {
    /*
    const ddoc = await mongoose
      .model('cateringestablishment')
      .findById(data.item)
    */

    // ?might be static fucntion
    let docc = await Review.aggregate([
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

    await CateringEstablishment.findByIdAndUpdate(data.item, docc[0])
  })
}

exports.recalculate = recalculate
