import { Router } from "express";
import {
    isFileUpload, getFileSize, isGetFile,addToFavorite,
    iGetSharedWithMe, getAllFiles, deleteFile,isGetFavorite
} from "./../controllers/fileController"
const router = Router();

router.post('/upload', isFileUpload)
router.get('/get-file-size', getFileSize)
router.post('/get-file', isGetFile)
router.get('/get-shared-files', iGetSharedWithMe)
router.get('/get-all-file', getAllFiles)
router.delete('/delete-file/:id', deleteFile)
router.delete('/delete-file/:id',deleteFile)
router.patch('/add-to-favourite/:id', addToFavorite)
router.get('/get-all-favorite', isGetFavorite)
    



export default router;