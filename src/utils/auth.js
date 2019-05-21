import config from '../config'
import {
  User,
  validateSignin,
  validateSignup
} from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const { error } = validateSignup(req.body)

  if (error) {
    return res.status(400).send(error)
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return res.status(400).send('Password and Confirm Password do not match')
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    return res.status(500).send(e)
  }
}

export const signin = async (req, res) => {
  const { error } = validateSignin(req.body)
  let user

  if (error) {
    return res.status(400).send(error.details[0])
  }

  try {
    user = await User.findOne({ email: req.body.email })
      .select('name email password')
      .exec()

    if (!user) {
      return res
        .status(401)
        .send({ message: 'Invalid email and passoword combination' })
    }

    const match = await user.comparePassword(req.body.password)

    if (!match) {
      return res
        .status(401)
        .send({ message: 'Invalid email and passoword combination' })
    }
    const token = newToken(user)

    return res.status(201).send({ user: user.toObject(), token: token })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).end()
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.status(401).end()
  }

  req.user = user
  next()
}
