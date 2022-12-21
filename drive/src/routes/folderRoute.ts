import express from 'express';
import {isCreateFolder, isGetFolder, getAllFolders} from '../controllers/folderController'
const router = express.Router()


router.post('/create-folder', isCreateFolder)
router.post('/get-folder', isGetFolder)
router.post('/get-all-folders',getAllFolders )


export default router;