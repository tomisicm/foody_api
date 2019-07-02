import { Food } from './food.model'

export const getFoodsByCateringId = async (req, res) => {}

export const createFood = async (req, res) => {}

export const updateFood = async (req, res) => {}

export const deleteFood = async (req, res) => {}

export default {
  createOne: createFood,
  updateOne: updateFood,
  deleteOne: deleteFood,
  getManyByCateringId: getFoodsByCateringId
}
