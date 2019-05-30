import { Router } from 'express'
import controllers from './comment.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.route('/').post(protect, controllers.createComment)

router.route('/item/:itemId').get(controllers.getCommentsByItemId)

export default router
