import { Router } from 'express'

import controllers from './statistic.controller'

const router = Router()

router.route('/').post(controllers.generateStatistics)

export default router
