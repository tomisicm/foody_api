import { Object } from './object.model'

const createObject = async (req, res) => {
  const createdBy = req.user._id

  try {
    const doc = await Object.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default {
  getOne: createObject
}
