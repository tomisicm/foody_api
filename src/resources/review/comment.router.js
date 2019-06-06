import { Router } from 'express'
import controllers from './comment.controller'
import { protect } from '../../utils/auth'

import { findDocumentByModelAndId } from '../../middleware/item.middleware'

const router = Router()

router
  .route('/')
  .post(protect, findDocumentByModelAndId, controllers.createComment)

router.route('/:id').put(protect, controllers.editComment)

router.route('/item/:itemId').get(controllers.getCommentsByItemId)

router.route('/:id').delete(protect, controllers.deleteComment)

export default router
