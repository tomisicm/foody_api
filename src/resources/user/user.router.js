import { Router } from 'express'
import { me, updateMe, getUsersByNameOrEmail } from './user.controller'
import { protect } from '../../utils/auth'

const router = Router()

router.get('/', protect, me)
router.put('/', protect, updateMe)
router.get('/all', getUsersByNameOrEmail)

export default router
