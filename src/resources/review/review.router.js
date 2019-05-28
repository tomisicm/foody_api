import { Router } from 'express'
import controllers from './review.controller'

const router = Router()

router.route('/item/:itemId').get(controllers.getMany)

export default router
