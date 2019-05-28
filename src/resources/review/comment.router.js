import { Router } from 'express'
import controllers from './comment.controller'

const router = Router()

router.route('/item/:itemId').get(controllers.getCommentsByItemId)

export default router
