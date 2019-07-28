import mongoose from 'mongoose'

class DocumentService {
  findDocumentByCollectionAndId = async (docId, collection) => {
    try {
      const doc = await mongoose.model(collection).findById(docId)
      return doc
    } catch (e) {
      throw e
    }
  }
}

exports.DocumentService = DocumentService
