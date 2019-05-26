import { Router } from 'express'
import controllers from './cuisine.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.route('/').post(protect, controllers.createOne)

router.route('/').get(controllers.getMany)

export default router
