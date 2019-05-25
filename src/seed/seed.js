const mongoose = require('mongoose')
const dummy = require('mongoose-dummy')

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

mongoose.connect('mongodb://localhost:27017/food_rating', {
  useNewUrlParser: true
})

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

let foodOrigin = ['Thai', 'Japanese', 'Italian']

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
    foodOrigin: {
      name: {
        type: String,
        enum: foodOrigin
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

for (let i = 0; i < 5; i++) {
  let randomObject = dummy(model, {
    ignore: ignoredFields,
    returnDate: true
  })

  model.create(randomObject)
}
