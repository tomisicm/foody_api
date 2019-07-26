import { CateringEstablishment } from './catering.model'
import { DocumentService } from '../documentService'

class CateringService extends DocumentService {
  async createCatering(catering, user) {
    try {
      const doc = await CateringEstablishment.create({
        ...catering,
        pageMaintainedBy: user
      })

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async editCatering(cateringId, catering, user) {
    try {
      let doc = await CateringEstablishment.findById(cateringId)

      if (!doc) {
        throw new Error('catering does not exist')
      }

      if (!doc.canMaintainCatering(user)) {
        throw new Error('Oi mate you aint got loicence for that!')
      }

      doc = Object.assign(doc, { ...catering })

      doc = await doc.save()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async deleteCatering(cateringId, user) {
    let doc = await CateringEstablishment.findById(cateringId)

    if (!doc) {
      throw new Error('catering does not exist')
    }

    if (!(doc.canMaintainCatering(user._id) || user.admin)) {
      throw new Error('Oi mate you aint got loicence for that!')
    }

    return doc
  }
}

const cateringService = new CateringService()

export default cateringService
