import { Review } from './review.model'
import ReviewService from './reviewService'

export const getReviews = async (req, res) => {
  const { perPage, page, sort = '-updatedAt' } = req.query

  const options = {
    populate: [
      {
        path: 'createdBy',
        select: '_id name'
      },
      {
        path: 'item'
      }
    ],
    sort: sort,
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await Review.paginate({}, options)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const searchForReviews = async (req, res) => {
  const user = req.user || null
  let query = req.query
  const { review, catering } = req.body

  try {
    const docs = await ReviewService.searchForReviews(
      user,
      query,
      review,
      catering
    )
    res.status(200).json(docs)
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const getReviewsByItemId = async (req, res) => {
  const user = req.user ? req.user : null
  const { perPage, page } = req.query
  const itemId = req.params.itemId

  try {
    const doc = await ReviewService.getReviewsByItemId(
      user,
      perPage,
      page,
      itemId
    )

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const getReviewById = async (req, res) => {
  const user = req.user ? req.user._id : null

  try {
    const doc = await Review.findById(req.params.id)
      .populate([
        {
          path: 'createdBy',
          select: '_id name profile'
        },
        {
          path: 'item'
        }
      ])
      .lean()

    determineLikes(user, doc)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createReview = async (req, res) => {
  const createdBy = req.user._id

  const value = req.parsed

  try {
    const doc = await ReviewService.createReview(value, createdBy)

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const editReviewStatus = async (req, res) => {
  const value = req.parsed
  const reviewId = req.params.id
  const user = req.user

  try {
    const doc = await ReviewService.editReviewStatus(reviewId, value, user)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const editReview = async (req, res) => {
  const reviewId = req.params.id
  const createdBy = req.user._id
  const value = req.parsed

  try {
    const doc = await ReviewService.editReview(reviewId, value, createdBy)

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const likeReview = async (req, res) => {
  const user = req.user._id
  const reviewId = req.params.id

  try {
    const doc = await ReviewService.likeReview(reviewId, user)
    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

// Accepts plane JS docs
function determineLikes(user, doc) {
  const data = {}

  const { likedBy } = doc

  data.likes = likedBy.length

  if (likedBy.indexOf(user) > -1) {
    data.liked = true
  }

  doc.likedBy = Object.assign({}, data)
}

export default {
  searchForReviews,
  getReviews,
  getReviewsByItemId,
  getReviewById,
  createReview,
  editReview,
  editReviewStatus,
  likeReview
}
