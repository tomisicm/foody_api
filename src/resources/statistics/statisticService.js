import mongoose from 'mongoose'
import moment from 'moment'

import MODEL from '../models'

class Statistics {
  async countNewlyCreatedDocuments(model) {
    const doc = await mongoose.model(MODEL.REVIEW).aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment()
              .startOf('week')
              .toDate()
          }
        }
      },
      {
        $count: 'weeklyReviewStatistic'
      }
    ])
    return doc
  }
}

const statisticService = new Statistics()

export default statisticService
