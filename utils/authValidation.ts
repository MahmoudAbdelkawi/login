import { check } from "express-validator/src/middlewares/validation-chain-builders";
import Users from './../models/user';
import ApiError from "./ApiError";
import { StatusCodes } from 'http-status-codes';

const forgetPasswordValidation = [
    check('email').isEmail().withMessage("Email Not Valid")
]
const updatePassword = [
    ...forgetPasswordValidation,
    check('password').isLength({min:8}).withMessage("the password should be more than 8 characters")
]
const confirmationCodeValidation = [...forgetPasswordValidation,check('code').isNumeric().withMessage("Not Valid Code").isLength({min:6,max:6}).withMessage("Code should be 6 digits")]
const signupValidation = [
    check('email').isEmail().withMessage("Email Not Valid").custom(async(email:string)=>{
        const user = await Users.findOne({email})
        if (user) {
            return Promise.reject(new ApiError("Email Already used",StatusCodes.NOT_IMPLEMENTED))
        }
        else return true
        
    }),
    check('fullName').notEmpty().withMessage("fullName is Required"),
    check('userName').notEmpty().withMessage("userName is Required").custom(async(userName:string)=>{
        const user = await Users.findOne({userName})
        if (user) {
            return Promise.reject(new ApiError("UserName Already used",StatusCodes.NOT_IMPLEMENTED))
        }
        else return true
        
    }),
    check('password').isLength({min:8}).withMessage("the password should be more than 8 characters"),
    check('confirmationPassword').custom((confirmationPassword , {req})=>{
        if (confirmationPassword != req.body.password) {
            return Promise.reject(new ApiError("password doesn't match with the password confirmation",StatusCodes.NOT_IMPLEMENTED ))
        }
        return true
        
    }),
]
const loginValidation = [
    check('email').isEmail().withMessage("Email Not Valid"),
    check('password').isLength({min:8}).withMessage("the password should be more than 8 characters"),
]

export {signupValidation,loginValidation , forgetPasswordValidation,confirmationCodeValidation,updatePassword}


