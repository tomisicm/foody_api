import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

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
      index: true,
      uniqueCaseInsensitive: true,
      trim: true,
      maxlength: 50
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true
    },
    user: {
      type: Boolean,
      default: true
    },
    admin: {
      type: Boolean,
      default: false
    },
    profile: {
      profession: {
        type: String,
        default: null
      },
      avatar: {
        type: String,
        default: null
      }
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

userSchema.methods.isAdmin = function() {
  return this.admin
}

userSchema.statics.findByEmail = function(email) {
  return this.find({ email: new RegExp(email, 'i') })
}

userSchema.plugin(uniqueValidator)

userSchema.plugin(mongoosePaginate)

exports.User = mongoose.model('user', userSchema)
