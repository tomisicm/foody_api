import { Cuisine } from './cuisine.model'

export const getManyCuisines = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 100
  }

  try {
    const doc = await Cuisine.paginate({}, options)

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createCuisine = async (req, res) => {
  const createdBy = req.user._id

  try {
    const doc = await Cuisine.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  createOne: createCuisine,
  getMany: getManyCuisines
}
