import Joi from '@hapi/joi'
Joi.objectId = require('joi-objectid')(Joi)

const email = Joi.string()
  .trim()
  .email({ minDomainAtoms: 2 })
  .max(50)
  .required()
  .label('email')

const password = Joi.string()
  .trim()
  .min(8)
  .required()
  .label('password')

const passwordConfirm = Joi.any()
  .required()
  .valid(Joi.ref('password'))
  .label('passwordConfirm')

export const signinSchema = Joi.object().keys({
  email: email,
  password: password
})

export const signupSchema = Joi.object().keys({
  email: email,
  password: password,
  passwordConfirm: passwordConfirm
})

export const updateUserProfileSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .min(8),

  profile: Joi.object().keys({
    profession: Joi.string()
      .trim()
      .min(8)
  })
})
