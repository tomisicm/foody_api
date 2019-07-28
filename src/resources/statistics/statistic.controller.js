import statisticService from './statisticService'

export const generateStatistics = async (req, res) => {
  try {
    const doc = await statisticService.countNewlyCreatedDocuments()

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  generateStatistics
}
