import { Food } from './food.model'

export const getFoodsByCateringId = async (req, res) => {}

export const createFood = async (req, res) => {
  const createdBy = req.user._id

  try {
    const doc = await Food.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const updateFood = async (req, res) => {}

export const deleteFood = async (req, res) => {}

export default {
  createOne: createFood,
  updateOne: updateFood,
  deleteOne: deleteFood,
  getManyByCateringId: getFoodsByCateringId
}
