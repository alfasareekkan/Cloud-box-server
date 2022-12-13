import express from 'express';
import {signUpPost,loginPost} from '../controllers/authController'

const router = express.Router()


router.post('/signup',signUpPost)


router.post('/login',loginPost)
// router.get('/logout')


export default router