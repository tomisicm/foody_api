import { User } from './user.model'

import _ from 'lodash'

// TODO: Take a look at this.
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).send({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id)

    user.name = req.body.username
    user.email = req.body.email
    user.profile.profession = req.body.profession

    user = await user.save()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).end()
  }

  // const filePath = req.protocol + '://' + req.hostname + '/' + req.file.path

  try {
    const user = await User.findById(req.user._id)

    user.profile.avatar = req.file.path

    await user.save()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getUsersByNameOrEmail = async (req, res) => {
  let rq = req.query
  const { perPage, page } = req.query

  let query = null
  if (!_.isEmpty(rq)) {
    query = {
      $or: [
        { name: { $regex: rq.query, $options: 'i' } },
        { email: { $regex: rq.query, $options: 'i' } }
      ]
    }
  }
  const options = {
    sort: 'createdAt',
    page: parseInt(page, 10) || 1,
    limit: parseInt(perPage, 10) || 10
  }

  try {
    const docs = await User.paginate(query, options)

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
