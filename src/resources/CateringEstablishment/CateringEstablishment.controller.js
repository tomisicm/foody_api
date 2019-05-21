import { CateringEstablishment } from './CateringEstablishment.model'

export const getOneCateringEstablishment = async (req, res) => {
  try {
    const doc = await CateringEstablishment.findById(req.params.id)
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// this route might not be necassary
export const getManyCateringEstablishment = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await CateringEstablishment.paginate({}, options)

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createCateringEstablishment = async (req, res) => {
  const createdBy = req.user._id

  try {
    const doc = await CateringEstablishment.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  createOne: createCateringEstablishment,
  getOne: getOneCateringEstablishment,
  getMany: getManyCateringEstablishment
}
