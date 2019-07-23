import { Router } from 'express'
import { validateSignin, validateSignup } from './auth.middleware'
import { signup, signin } from './auth'

const router = Router()

router.route('/signin').post(validateSignin, signin)

router.route('/signup').post(validateSignup, signup)

export default router
