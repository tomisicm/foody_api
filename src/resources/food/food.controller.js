import { Food, validateCreateObject, validateEditObject } from './food.model'

export const getFoodsByCateringId = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    sort: 'updatedAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10,
    lean: true
  }
  try {
    const docs = await Food.paginate(
      { item: req.params.itemId, replyTo: null },
      options
    )
    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const createFood = async (req, res) => {
  const createdBy = req.user._id

  const { error, value } = validateCreateObject(req.body)
  if (error) return res.status(400).send(error)

  try {
    const doc = await Food.create({ ...value, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const updateFood = async (req, res) => {
  const { error, value } = validateEditObject(req.body)
  if (error) return res.status(400).send(error)

  try {
    const updatedDoc = await Food.findByIdAndUpdate(req.params.id, value, {
      new: true
    })
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const deleteFood = async (req, res) => {
  try {
    const doc = await Food.findById({
      _id: req.params.id
    })

    if (!doc) return res.status(400).end()

    await doc.remove()

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  createOne: createFood,
  updateOne: updateFood,
  deleteOne: deleteFood,
  getManyByCateringId: getFoodsByCateringId
}
