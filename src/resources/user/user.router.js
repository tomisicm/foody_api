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
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter
})

const router = Router()

router.get('/', protect, me)
router.put('/', protect, updateMe)

router.put('/avatar', protect, upload.single('avatar'), updateAvatar)

router.get('/all', getUsersByNameOrEmail)

export default router
