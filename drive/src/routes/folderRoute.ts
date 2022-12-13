import express from 'express';
import {isCreateFolder} from '../controllers/folderController'
const router = express.Router()


router.post('/createFolder',isCreateFolder)

export default router;