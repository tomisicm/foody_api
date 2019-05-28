const mongoose = require('mongoose')
const dummy = require('mongoose-dummy')

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

mongoose.connect('mongodb://localhost:27017/food_rating', {
  useNewUrlParser: true
})

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/]

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      default: null
    },
    replayTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment',
      default: null
    }
  },
  { timestamps: true }
)

let model = mongoose.model('comment', commentSchema)

for (let i = 0; i < 5; i++) {
  let randomObject = dummy(model, {
    ignore: ignoredFields,
    returnDate: true
  })

  model.create(randomObject)
}
