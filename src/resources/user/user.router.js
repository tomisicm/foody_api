import { Router } from 'express'
import { me, updateMe, getUsersByNameOrEmail } from './user.controller'

const router = Router()

router.get('/', me)
router.put('/', updateMe)
router.get('/all', getUsersByNameOrEmail)

export default router
