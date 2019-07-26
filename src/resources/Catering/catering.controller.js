import _ from 'lodash'

import { CateringEstablishment } from './catering.model'
import CateringService from './cateringService'

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
    res.status(400).send(e)
  }
}

export const createCateringEstablishment = async (req, res) => {
  const value = req.parsed
  const userId = req.user._id

  try {
    const doc = await CateringService.createCatering(value, userId)

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const editCateringEstablishment = async (req, res) => {
  const cateringId = req.params.id
  const userId = req.user._id
  const value = req.parsed

  try {
    const doc = await CateringService.editCatering(cateringId, value, userId)

    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }

  res.status(201)
}

// add pre remove hook for deleting all the comments and reviews
export const deleteCateringEstablishment = async (req, res) => {
  const cateringId = req.params.id
  const user = req.user

  try {
    const doc = await CateringService.deleteCatering(cateringId, user)

    return res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

/* 
function setupQuery(queryObject, newQueryProp) {
  queryObject = {...queryObject, newQueryProp}
} 
*/

export default {
  createOne: createCateringEstablishment,
  editOne: editCateringEstablishment,
  getOne: getOneCateringEstablishment,
  getMany: getManyCateringEstablishment,
  searchFor: searchForCateringEstablishment,
  deleteOne: deleteCateringEstablishment
}
