const mongoose = require('mongoose')
const dummy = require('mongoose-dummy')

mongoose.connect('mongodb://localhost:27017/food_rating', {
  useNewUrlParser: true
})

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

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
    }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        delete ret.__v
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        delete ret.__v
      }
    }
  },
  { timestamps: true }
)

let model = mongoose.model('cateringEstablishment', cateringEstablishment)

for (let i = 0; i < 50; i++) {
  let randomObject = dummy(model, {
    /* ignore: ignoredFields */
    returnDate: true
  })

  model.create(randomObject)
}

mongoose.connection.close()
