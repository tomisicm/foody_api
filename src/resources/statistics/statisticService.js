import mongoose from 'mongoose'
import moment from 'moment'

class Statistics {
  async countNewlyCreatedDocuments(model) {
    const doc = await mongoose.model(model).aggregate([
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
        $count: 'weeklyStatistic'
      }
    ])

    console.log(mongoose.modelNames())
    return doc
  }
}

const statisticService = new Statistics()

export default statisticService
