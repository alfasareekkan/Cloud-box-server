import { Router } from "express";
import { getUserDetails,sendOtp ,submitOtp, changePassword, forgotOtp, updateNewPassword, isSubmitOtp} from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";
const router = Router();

router.get("/get-user", verifyJWT, getUserDetails)
router.post("/send-otp", verifyJWT, sendOtp)
router.post("/submit-otp", verifyJWT, submitOtp)
router.post("/change-password", verifyJWT, changePassword)
router.post("/forgot-password", forgotOtp);
router.post("/new-password", updateNewPassword);
router.post("/otp-password", isSubmitOtp);






export default router