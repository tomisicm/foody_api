import mongoose from 'mongoose'
import { Err } from '@hapi/joi/lib/errors'

// itemType is ref to the model
export const findDocumentByModelAndId = async (req, res, next) => {
  try {
    const doc = await mongoose.model(req.body.itemType).findById(req.body.item)

    if (!doc) {
      return res.status(404).send({
        message: 'no item found'
      })
    }
    next()
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// itemType is ref to the model
export const findDocumentByCollectionAndId = async (
  docId,
  collection,
  message = 'Collection does not contain document with specified id.'
) => {
  try {
    const doc = await mongoose.model(collection).findById(docId)

    console.log(doc)
    if (!doc) {
      throw new Error(message)
    }

    return doc
  } catch (e) {
    console.error(e)
    throw e
  }
}
