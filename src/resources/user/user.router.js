import { Router } from 'express'
import {
  me,
  updateMe,
  updateAvatar,
  getUsersByNameOrEmail
} from './user.controller'

import { protect } from '../../utils/auth'

import multer from 'multer'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const upload = multer({ storage })

const router = Router()

router.get('/', protect, me)
router.put('/', protect, updateMe)

router.put('/avatar', protect, upload.single('avatar'), updateAvatar)

router.get('/all', getUsersByNameOrEmail)

export default router
