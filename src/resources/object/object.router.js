import { Router } from 'express'
import controllers from './object.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.route('/').post(protect, controllers.createOne)

export default router
