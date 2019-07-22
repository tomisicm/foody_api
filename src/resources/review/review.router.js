import { Router } from 'express'
import controllers from './review.controller'
import { authorization } from '../../utils/auth'

const router = Router()

router.route('/').post(authorization, controllers.createReview)

router.route('/:id/status').put(authorization, controllers.editReviewStatus)
router.route('/:id').put(authorization, controllers.editReview)

router.route('/:id/like').post(authorization, controllers.likeReview)

router.route('/').get(controllers.getReviews)

router.route('/search').post(controllers.searchForReviews)

router.route('/item/:itemId').get(controllers.getReviewsByItemId)
router.route('/:id').get(controllers.getReviewById)

export default router
