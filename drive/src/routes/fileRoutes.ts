import { Router } from "express";
import {isFileUpload,getFileSize,isGetFile} from "./../controllers/fileController"
const router = Router();

router.post('/upload', isFileUpload)
router.get('/get-file-size', getFileSize)
router.post('/get-file',isGetFile)



export default router;