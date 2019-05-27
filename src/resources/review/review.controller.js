import { Review } from './review.model'

export const getReviewsByItemId = async (req, res) => {
  const { perPage, page } = req.query

  console.log(req.params.id)

  const options = {
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await Review.paginate({}, options)

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  getMany: getReviewsByItemId
}
