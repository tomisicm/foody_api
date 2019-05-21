import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import bcrypt from 'bcrypt'
import Joi from '@hapi/joi'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      trim: true,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true
    }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        delete ret.password
        delete ret.__v
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password
        delete ret.__v
      }
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash
    next()
  })
})

userSchema.methods.comparePassword = function(password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
}

userSchema.plugin(mongoosePaginate)

function validateSignup(user) {
  const schema = {
    email: Joi.string()
      .trim()
      .email({ minDomainAtoms: 2 })
      .max(50)
      .required(),
    password: Joi.string()
      .trim()
      .min(8)
      .required(),
    passwordConfirm: Joi.string()
      .trim()
      .min(8)
      .required()
  }
  return Joi.validate(user, schema)
}

function validateSignin(user) {
  const schema = {
    email: Joi.string()
      .trim()
      .email({ minDomainAtoms: 2 })
      .max(50)
      .required(),
    password: Joi.string()
      .trim()
      .min(8)
      .required()
  }
  return Joi.validate(user, schema)
}

exports.validateSignup = validateSignup
exports.validateSignin = validateSignin
exports.User = mongoose.model('user', userSchema)
