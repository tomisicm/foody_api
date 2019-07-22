import { Router } from 'express'
import controllers from './comment.controller'
import { authorization } from '../../utils/auth'
import {
  validateCreateObject,
  validateEditObject
} from '../review/comment.middleware'

// import { findDocumentByModelAndId } from '../../middleware/item.middleware'

const router = Router()

router
  .route('/')
  .post(authorization, validateCreateObject, controllers.createComment)

router
  .route('/:id')
  .put(authorization, validateEditObject, controllers.editComment)

router.route('/item/:itemId').get(controllers.getCommentsByItemId)

router.route('/:id').delete(authorization, controllers.deleteComment)

export default router
