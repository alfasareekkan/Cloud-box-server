import { Router } from "express";
import { getUserDetails,sendOtp } from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";
const router = Router();

router.get("/get-user", verifyJWT, getUserDetails)
router.post("/send-otp",verifyJWT,sendOtp)



export default router