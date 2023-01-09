import { Router } from "express";
import {isFileUpload,getFileSize,isGetFile,iGetSharedWithMe,getAllFiles} from "./../controllers/fileController"
const router = Router();

router.post('/upload', isFileUpload)
router.get('/get-file-size', getFileSize)
router.post('/get-file', isGetFile)
router.get('/get-shared-files', iGetSharedWithMe)
router.get('/get-all-file',getAllFiles)
    



export default router;