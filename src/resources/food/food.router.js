import { Router } from 'express'
import controllers from './food.controller'
import { authorization } from '../../utils/auth'

const router = Router()

router.route('/').post(authorization, controllers.createOne)

router.route('/catering/:cateringId').get(controllers.getManyByCateringId)

router.route('/:id').put(authorization, controllers.updateOne)

router.route('/:id').delete(authorization, controllers.deleteOne)

export default router
