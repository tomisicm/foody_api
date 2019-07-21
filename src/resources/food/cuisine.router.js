import { Router } from 'express'
import controllers from './cuisine.controller'
import { authorization } from '../../utils/auth'

const router = Router()

router.route('/').post(authorization, controllers.createOne)

router.route('/').get(controllers.getMany)

export default router
