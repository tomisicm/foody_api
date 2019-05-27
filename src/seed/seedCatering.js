const mongoose = require('mongoose')
const dummy = require('mongoose-dummy')

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

mongoose.connect('mongodb://localhost:27017/food_rating', {
  useNewUrlParser: true
})

let cuisine = ['Thai', 'Japanese', 'Italian', 'Pakistani', 'Indian']

const cateringEstablishment = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      trim: true,
      maxlength: 50
    },
    address: {
      city: String,
      street: String,
      streetNo: Number
    },
    cuisine: {
      name: {
        type: String,
        enum: cuisine
      }
    },
    rating: {
      type: Number
    },
    michelinStars: {
      type: Number
    }
  },
  { timestamps: true }
)

let model = mongoose.model('cateringEstablishment', cateringEstablishment)

for (let i = 0; i < 500; i++) {
  let randomObject = dummy(model, {
    ignore: ignoredFields,
    returnDate: true
  })

  model.create(randomObject)
}
