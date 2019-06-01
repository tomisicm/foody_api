import mongoose from 'mongoose'

// itemType is ref to the model
export const findDocumentByModelAndId = async (req, res, next) => {
  try {
    const doc = await mongoose.model(req.body.itemType).findById(req.body.item)

    if (!doc) {
      return res.status(400).send('no item')
    }
    next()
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
