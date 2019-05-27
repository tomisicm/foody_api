const mongoose = require('mongoose')
const dummy = require('mongoose-dummy')

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

mongoose.connect('mongodb://localhost:27017/food_rating', {
  useNewUrlParser: true
})

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

let users = [
  '5ce447b948f88d44cc4ad144',
  '5ce792974f06937febe16b9b',
  '5ce7977f4f06937febe16b9d',
  '5ce7d1aa32194485d8082bec',
  '5ce7e71c32194485d8082bed'
]

const reivewSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.SchemaTypes.ObjectId
    },
    generalImpression: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500
    },
    foodSection: {
      type: String,
      trim: true,
      default: null,
      maxlength: 500
    },
    staffSection: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      enum: users
    },
    // this field will only be changable by admins
    approved: {
      type: mongoose.SchemaTypes.ObjectId
    }
  },
  { timestamps: true }
)

let model = mongoose.model('review', reivewSchema)

for (let i = 0; i < 5; i++) {
  let randomObject = dummy(model, {
    ignore: ignoredFields,
    returnDate: true
  })

  model.create(randomObject)
}
