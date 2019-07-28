import statisticService from './statisticService'

import MODEL from '../models'

// this aggregation is heavy. creating CRON job which will trigger this once
// and store results in data base is the way to go
export const generateStatistics = async (req, res) => {
  try {
    const reviewData = await statisticService.countNewlyCreatedDocuments(
      MODEL.REVIEW
    )
    const userData = await statisticService.countNewlyCreatedDocuments(
      MODEL.USER
    )
    const cateringData = await statisticService.countNewlyCreatedDocuments(
      MODEL.CATERING
    )

    res.status(200).json({ cateringData, userData, reviewData })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  generateStatistics
}
