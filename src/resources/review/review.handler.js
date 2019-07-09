import { reviewHandler } from './reveiw.emitter'

const recalculate = function() {
  reviewHandler.on('dick', data => console.log(data))
}

exports.recalculate = recalculate
