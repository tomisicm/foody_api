import { Router } from 'express'
import controllers from './catering.controller'
import { authorization } from '../../utils/auth'

import { validateCreateObject, validateEditObject } from './catering.middleware'

const router = Router()

router
  .route('/')
  .post(authorization, validateCreateObject, controllers.createOne)

router.route('/').get(controllers.getMany)

router.route('/search').post(controllers.searchFor)

router.route('/:id').get(controllers.getOne)

router.route('/:id').put(authorization, validateEditObject, controllers.editOne)

export default router
