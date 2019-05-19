import { Router } from 'express'
import { me, updateMe, getMany } from './user.controller'

const router = Router()

router.get('/', me)
router.put('/', updateMe)
router.get('/all', getMany)

export default router
