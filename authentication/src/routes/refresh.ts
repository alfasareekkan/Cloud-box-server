import express from "express";
const router = express.Router();
// const refreshTokenController = require('../controllers/refreshTokenController');
import {handleRefreshToken} from "../controllers/refreshTokenController";

router.post('/', handleRefreshToken);

export default router