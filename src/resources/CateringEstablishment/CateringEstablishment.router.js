import { Router } from 'express'
import controllers from './cateringEstablishment.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.route('/').post(protect, controllers.createOne)

router.route('/').get(controllers.getMany)

router.route('/search').post(controllers.searchFor)

router.route('/:id').get(controllers.getOne)

export default router
