import { Router } from 'express'
import controllers from './review.controller'

const router = Router()

router.route('/').get(controllers.getMany)

export default router
