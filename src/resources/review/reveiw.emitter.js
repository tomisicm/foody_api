import EventEmitter from 'events'

class ReviewNotifier extends EventEmitter {}

const reviewNotifier = new ReviewNotifier()

exports.reviewNotifier = reviewNotifier
