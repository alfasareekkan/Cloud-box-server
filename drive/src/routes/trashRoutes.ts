import { Router } from "express"
import { getAllFiles } from "../controllers/trashController";
const router = Router();

router.get('/', getAllFiles)

export default router;