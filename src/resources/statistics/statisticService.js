import mongoose from 'mongoose'
import moment from 'moment'

import MODEL from '../models'

class Statistics {
  async countNewlyCreatedDocuments(model) {
    const doc = await mongoose.model(MODEL.REVIEW).find({
      createdAt: {
        $gte: moment().startOf('week')
      }
    })
    return doc
  }
}

const statisticService = new Statistics()

export default statisticService
