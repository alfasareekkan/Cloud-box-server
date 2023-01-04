import express from 'express';
import {isCreateFolder, isGetFolder, getAllFolders, isUserShareFolder} from '../controllers/folderController'
const router = express.Router()


router.post('/create-folder', isCreateFolder)
router.post('/get-folder', isGetFolder)
router.post('/get-all-folders', getAllFolders)
router.post('/share-folder',isUserShareFolder )



export default router;