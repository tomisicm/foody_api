import { Router } from 'express'
import {
  me,
  updateMe,
  updateAvatar,
  getUsersByNameOrEmail
} from './user.controller'

import { authorization } from '../../utils/auth'

import multer from 'multer'

// currently saving all images as .png
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/avatars')
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + '.png')
  }
})
const imageFilter = (req, file, cb) => {
  // !file.originalname.match(/\.(jpg|jpeg|png|gif)$/
  if (!file.mimetype === 'image/png') {
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

router.get('/', authorization, me)
router.put('/', authorization, updateMe)

router.post('/avatar', authorization, upload.single('file'), updateAvatar)

router.get('/all', getUsersByNameOrEmail)

export default router
