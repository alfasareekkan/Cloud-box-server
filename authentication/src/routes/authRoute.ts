import express from 'express';
import { signUpPost, loginPost } from '../controllers/authController'
import { googleSignUp } from '../controllers/googleAuthController';

const router = express.Router()


router.post('/signup',signUpPost)


router.post('/login', loginPost)
router.post('/google-signup',googleSignUp)
// router.get('/logout')


export default router