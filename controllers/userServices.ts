import express,{ NextFunction, Request,Response } from "express"
import expressAsyncHandler from "express-async-handler"
import Users from './../models/user';
import path from "path";



// @desc       search on profile
// @route     /user/:userName
// @access    GET/public

const searchForUser = expressAsyncHandler((req:Request,res:Response , next:NextFunction)=>{
    res.send(req.searchUser)
})

const getUserLoggedData = expressAsyncHandler((req:Request,res:Response , next:NextFunction)=>{
    const {fullName, userName , email , role , followers , followings , posts , saves , bio , profileImage} = req.user
    res.send({fullName, userName , email , role , followers , followings , posts , saves , bio , profileImage})
})


// @desc       update bio on profile
// @route     /user/updateBio
// @access    PUT/public

const updateBio = expressAsyncHandler(async (req:Request,res:Response , next:NextFunction)=>{
    const {bio} = req.body
    const user = await Users.findByIdAndUpdate(req.user._id , {'$set':{bio}},{new: true})
    res.send(user)
})


// @desc       update image on profile
// @route     /user/updateImage
// @access    PUT/public

const updateImage = expressAsyncHandler(async (req:Request,res:Response , next:NextFunction)=>{
    const user:any = await Users.findById(req.user._id)
    user.profileImage = req.fileName
    await user?.save()
    res.send(user)
})


export {searchForUser,updateBio,updateImage,getUserLoggedData}