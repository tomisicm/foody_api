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
    cb(null, './public/avatars')
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false)
  } else {
    cb(null, true)
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: imageFilter
})

const router = Router()

router.get('/', protect, me)
router.put('/', protect, updateMe)

router.post('/avatar', protect, upload.single('file'), updateAvatar)

router.get('/all', getUsersByNameOrEmail)

export default router
