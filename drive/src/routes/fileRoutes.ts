import { Router } from "express";
import {isFileUpload} from "./../controllers/fileController"
const router = Router();

router.post('/upload',isFileUpload)


export default router;