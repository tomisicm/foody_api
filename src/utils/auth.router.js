import { Router } from 'express'
import { validateSignin, validateSignup } from './auth.middleware'
import { signup, signin } from './auth'

const router = Router()

console.log(router)

router.route('/signin').post(validateSignin, signin)

router.route('/signup').post(validateSignup, signup)

module.exports = router
