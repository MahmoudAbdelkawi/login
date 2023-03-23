import { Request,NextFunction, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Users from '../models/user';
import { DecodedToken, userType } from '../types';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ApiError from './../utils/ApiError';
import sendEmail from './../middlewares/nodeMailer';
import * as crypto from 'crypto';

// @desc       signup
// @route     /auth/signup
// @access    POST/public

const signup = expressAsyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    const {email,password,fullName,userName}:userType = req.body
    const hashedPassword:string = await hash(password,12)
    const user = await Users.create({email,fullName,password:hashedPassword,userName,passwordCreationDate:Date.now()})
    await user.save()
    const token : string = sign({id:user._id , role:user.role},`${process.env.JWT_SECRET_KEY}`,{expiresIn:`${process.env.EXPIRATION_TIME}`} ) ;
    res.header('token', token);
    res.status(StatusCodes.CREATED).json({user:{fullName : user.fullName , userName:user.userName, email:user.email ,role: user.role ,followers:user.followers , following:user.followings , posts:user.posts , saves:user.saves, bio:user.bio , profileImage:user.profileImage} , token})
})



// @desc       login
// @route     /auth/login
// @access    POST/public

const login = expressAsyncHandler(async (req:Request,res:Response,next:NextFunction)=>{

    const {email,password} = req.body
    const user = await Users.findOne({email})
    if (user) {     
        const passwordIsTure:boolean = await compare(password,user?.password)
        if(passwordIsTure)
        {
            await user.save()
            const token : string = sign({id:user._id , role:user.role},`${process.env.JWT_SECRET_KEY}`,{expiresIn:`${process.env.EXPIRATION_TIME}`} ) ;
            res.header('token', token);
            res.status(StatusCodes.OK).json({user:{fullName : user.fullName , userName:user.userName, email:user.email ,role: user.role ,followers:user.followers , following:user.followings , posts:user.posts , saves:user.saves, bio:user.bio , profileImage:user.profileImage} , token})
        }   
        else{
                next(new ApiError("Error in Email Or Password",StatusCodes.UNAUTHORIZED))
        }
    }
    else next(new ApiError("Error in Email Or Password",StatusCodes.UNAUTHORIZED))
})


// @desc       forgetPassword
// @route     /auth/forgetPassword
// @access    POST/public

const forgetPassword = expressAsyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    const {email} = req.body
    const user = await Users.findOne({email})
    if (user) {    
        let num : number = Math.floor(100000 + Math.random() * 900000) 
        let text:string = `your verification code is ${num}`
        let subject:string = `reset code`
        sendEmail({text, subject , email})
        user.verificationCode = sign({code:num}, `${process.env.JWT_SECRET_KEY_FOR_VERIFICATION_CODE}`,{expiresIn:`${process.env.EXPIRATION_TIME_FOR_VERIFICATION_CODE}`})
        await user.save()
        res.send({success:true})
    }
    else next(new ApiError("Email Not Found",StatusCodes.UNAUTHORIZED))
})


// @desc       confirmationCode
// @route     /auth/confirmationCode
// @access    POST/public

const confirmationCode = expressAsyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    const {code,email} = req.body
    const user:any = await Users.findOne({email})
    if (user.verificationCode) {
        const decode:any = verify(String(user.verificationCode),`${process.env.JWT_SECRET_KEY_FOR_VERIFICATION_CODE}`) 
        if (decode.code == code) {
            user.canChangePassword = true
            await user.save()
            res.send({success:true})
        }
        else next(new ApiError("the code is wrong" , StatusCodes.BAD_REQUEST))
    }
    else next(new ApiError("the code wasn't sent" , StatusCodes.BAD_REQUEST))
    
    
})


// @desc       updatePassword
// @route     /auth/updatePassword
// @access    PUT/public

const updatePassword = expressAsyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    const {email,password} = req.body
    const user:any = await Users.findOne({email})
    if (user.canChangePassword) {
        const hashedPassword:string = await hash(password,12)
        user.password = hashedPassword
        user.canChangePassword = false
        user.passwordCreationDate = Date.now() 
        await user.save()
        res.send({success:true})
    }
    else next(new ApiError("Not Available" , StatusCodes.BAD_REQUEST))
})

// @desc       canChangePassword
// @route     /auth/canChangePassword
// @access    get/public

const canChangePassword = expressAsyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    const {email} = req.body
    const user:any = await Users.findOne({email})
    res.send(user.canChangePassword) 
})



export {signup,login,forgetPassword,confirmationCode,updatePassword,canChangePassword}