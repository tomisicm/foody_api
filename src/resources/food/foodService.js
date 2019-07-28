import { Food } from './food.model'
import { DocumentService } from '../documentService'

class FoodService extends DocumentService {
  async createFood(food, userId) {
    try {
      const cateringestablishment = await this.findDocumentByCollectionAndId(
        food.catering,
        'cateringestablishment'
      )

      if (!cateringestablishment) {
        throw new Error('cateringestablishment does not exist')
      }

      if (!cateringestablishment.canMaintainCatering(userId)) {
        throw new Error('Oi mate you aint got loicence for that!')
      }

      const doc = await Food.create({
        ...food
      })

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async editFood(foodId, food, userId) {
    try {
      let doc = await Food.findById(foodId)

      if (!doc) {
        throw new Error('review does not exist')
      }

      const cateringestablishment = await this.findDocumentByCollectionAndId(
        doc.catering,
        'cateringestablishment'
      )

      if (!cateringestablishment) {
        throw new Error('cateringestablishment does not exist')
      }

      if (!cateringestablishment.canMaintainCatering(userId)) {
        throw new Error('Oi mate you aint got loicence for that!')
      }

      doc = Object.assign(doc, { ...food })

      doc = await doc.save()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async deleteFood(foodId, userId) {
    try {
      const doc = await Food.findById({
        _id: foodId
      })

      if (!doc) {
        throw new Error('food does not exist')
      }

      const cateringestablishment = await this.findDocumentByCollectionAndId(
        doc.catering,
        'cateringestablishment'
      )

      if (!cateringestablishment.canMaintainCatering(userId)) {
        throw new Error('Oi mate you aint got loicence for that!')
      }

      await doc.remove()
      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async getFoodsByCateringId(cateringId, perPage, page) {
    const options = {
      sort: 'updatedAt',
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      lean: true
    }

    try {
      const docs = await Food.paginate({ catering: cateringId }, options)
      return docs
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

const foodService = new FoodService()

export default foodService
