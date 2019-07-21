import { Router } from 'express'
import controllers from './catering.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.route('/').post(protect, controllers.createOne)

router.route('/').get(controllers.getMany)

router.route('/search').post(controllers.searchFor)

router.route('/:id').get(controllers.getOne)

router.route('/:id').put(protect, controllers.editOne)

export default router
