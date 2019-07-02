import { Router } from 'express'
import controllers from './food.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.route('/').post(protect, controllers.createOne)

router.route('/catering/:id').get(controllers.getManyByCateringId)

router.route('/:id').put(controllers.updateOne)

router.route('/:id').put(controllers.deleteOne)

export default router
