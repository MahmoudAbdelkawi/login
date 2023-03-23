import { NextFunction, Request, Response, Router } from "express";
import { confirmationCodeValidation, forgetPasswordValidation, loginValidation, signupValidation } from "../utils/authValidation";
import validResult from "../middlewares/validationResult";
import { canChangePassword, confirmationCode, forgetPassword, login, signup, updatePassword } from "../controllers/authServies";
import { protect, role } from "../middlewares/protect";
import  rateLimiter from 'express-rate-limit'
const router:Router = Router();
const limiter = rateLimiter({
	windowMs : 15 * 60 * 1000 , // 15 minutes
	max: 5, // 100 request in 15 minutes,
	message : 'too many requests you can try again after 15 minutes'
}) // prevent more than 100 requests in 15 minutes
router.post('/signup',signupValidation, validResult,signup);
router.post('/login', limiter,loginValidation, validResult,login);
router.post('/forgetPassword', forgetPasswordValidation , validResult,forgetPassword)
router.post('/confirmationCode',limiter ,  confirmationCodeValidation , validResult,confirmationCode)
router.put('/updatePassword', updatePassword ,validResult ,updatePassword)
router.post('/canChangePassword', forgetPasswordValidation , validResult, canChangePassword)
router.get('/', protect ,role(["user"]))
export default router