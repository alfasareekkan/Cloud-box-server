import express from "express";
const router = express.Router();
import {handleRefreshToken} from "../controllers/refreshTokenController";

router.post('/', handleRefreshToken);

export default router