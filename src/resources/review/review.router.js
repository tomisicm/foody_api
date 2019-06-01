import { Router } from 'express'
import controllers from './review.controller'
import { protect } from '../../utils/auth'
import { findDocumentByModelAndId } from '../../middleware/item.middleware'

const router = Router()

router
  .route('/')
  .post(protect, findDocumentByModelAndId, controllers.createReview)

router.route('/item/:itemId').get(controllers.getReviewsByItemId)

router.route('/:id').get(controllers.getReviewById)

export default router
