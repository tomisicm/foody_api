import { Router } from 'express'
import controllers from './food.controller'
import { authorization } from '../../utils/auth'

import {
  validateCreateObject,
  validateEditObject
} from '../food/food.middleware'

const router = Router()

router
  .route('/')
  .post(authorization, validateCreateObject, controllers.createOne)

router
  .route('/:id')
  .put(authorization, validateEditObject, controllers.updateOne)

router.route('/catering/:cateringId').get(controllers.getManyByCateringId)

router.route('/:id').delete(authorization, controllers.deleteOne)

export default router
