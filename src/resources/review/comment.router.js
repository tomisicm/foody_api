import { Router } from 'express'
import controllers from './comment.controller'
import { authorization } from '../../utils/auth'

import { findDocumentByModelAndId } from '../../middleware/item.middleware'

const router = Router()

router
  .route('/')
  .post(authorization, findDocumentByModelAndId, controllers.createComment)

router.route('/:id').put(authorization, controllers.editComment)

router.route('/item/:itemId').get(controllers.getCommentsByItemId)

router.route('/:id').delete(authorization, controllers.deleteComment)

export default router
