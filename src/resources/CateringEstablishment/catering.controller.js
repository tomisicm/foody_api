import _ from 'lodash'

import { CateringEstablishment, validateCreateObject } from './catering.model'

export const getOneCateringEstablishment = async (req, res) => {
  try {
    const doc = await CateringEstablishment.findById(req.params.id)
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const searchForCateringEstablishment = async (req, res) => {
  const { perPage, page } = req.query

  console.log(req.body)

  const { name, address, cuisine, ratingRange } = req.body

  let query = {}

  // TODO: Refactor later
  if (name) query = { name: { $regex: name, $options: 'i' } }
  if (!_.isEmpty(address.city)) {
    query = {
      ...query,
      'address.city': { $regex: address.city, $options: 'i' }
    }
  }
  if (!_.isEmpty(address.street)) {
    query = {
      ...query,
      'address.street': { $regex: address.street, $options: 'i' }
    }
  }
  if (address.streetNo) {
    query = {
      ...query,
      'address.streetNo': { $eq: address.streetNo }
    }
  }

  if (!_.isEmpty(cuisine)) {
    query = {
      ...query,
      'cuisine.name': { $in: cuisine }
    }
  }

  if (!_.isEmpty(ratingRange)) {
    query = {
      ...query,
      rating: { $gte: ratingRange[0], $lte: ratingRange[1] }
    }
  }

  const options = {
    populate: [{ path: 'cuisine' }],
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  console.log(query)

  try {
    const doc = await CateringEstablishment.paginate(query, options)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// this route might not be necassary
export const getManyCateringEstablishment = async (req, res) => {
  const { perPage, page } = req.query

  const options = {
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const doc = await CateringEstablishment.paginate({}, options)

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createCateringEstablishment = async (req, res) => {
  const createdBy = req.user._id

  const { error } = validateCreateObject(req.body)
  if (error) return res.status(400).send(error)

  try {
    const doc = await CateringEstablishment.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

// add pre remove hook for deleting all the comments and reviews
export const deleteCateringEstablishment = async (req, res) => {
  try {
    const removed = await CateringEstablishment.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

/* 
function setupQuery(queryObject, newQueryProp) {
  queryObject = {...queryObject, newQueryProp}
} 
*/

export default {
  createOne: createCateringEstablishment,
  getOne: getOneCateringEstablishment,
  getMany: getManyCateringEstablishment,
  searchFor: searchForCateringEstablishment,
  deleteOne: deleteCateringEstablishment
}
