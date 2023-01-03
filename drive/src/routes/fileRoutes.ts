import { Router } from "express";
import {isFileUpload,getFileSize} from "./../controllers/fileController"
const router = Router();

router.post('/upload', isFileUpload)
router.get('/get-file-size',getFileSize)


export default router;