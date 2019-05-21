import { Router } from 'express'
import controllers from './genre.controller'

const router = Router()

router.route('/').post(controllers.createOne)

export default router
