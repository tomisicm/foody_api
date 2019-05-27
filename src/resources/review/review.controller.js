import { Review } from './review.model'

export const getReviewsByItemId = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await Review.paginate({ item: req.params.itemId }, options)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  getMany: getReviewsByItemId
}
