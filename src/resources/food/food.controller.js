import foodService from './foodService'

export const getFoodsByCateringId = async (req, res) => {
  const { perPage, page } = req.query
  const cateringId = req.params.cateringId

  try {
    const docs = await foodService.getFoodsByCateringId(
      cateringId,
      perPage,
      page
    )
    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const createFood = async (req, res) => {
  const createdBy = req.user._id
  const value = req.parsed

  try {
    const doc = await foodService.createFood(value, createdBy)

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const updateFood = async (req, res) => {
  const foodId = req.params.id
  const user = req.user._id
  const value = req.parsed

  try {
    const doc = await foodService.editFood(foodId, value, user)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const deleteFood = async (req, res) => {
  const foodId = req.params.id
  const user = req.user._id

  try {
    const doc = await foodService.deleteFood(foodId, user)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  createOne: createFood,
  updateOne: updateFood,
  deleteOne: deleteFood,
  getManyByCateringId: getFoodsByCateringId
}
