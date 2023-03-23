import { NextFunction, Request, Response } from "express"
import expressAsyncHandler from "express-async-handler"
import ApiError from './../utils/ApiError';
import Users from './../models/user';
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { DecodedToken } from "../types";

const protect = expressAsyncHandler(async function(req:Request,res:Response,next:NextFunction){
    if (req.headers.authorization || req.body.token) {
        let token = req.headers.authorization?.toString().split(" ")[1] || req.body.token
        if (token == "null") {
            token = req.body.token
        }
        const decode : DecodedToken|any = verify(String(token),`${process.env.JWT_SECRET_KEY}`) 
        const user = await Users.findById(decode.id)
        const time:any = user?.passwordCreationDate.getTime() / 1000;
        const passwordCreationDate = parseInt(time, 10)
        if (decode.iat >= passwordCreationDate) {
            req.user = user
            next()
        }    
        else next(new ApiError("Token Not valid" , StatusCodes.BAD_REQUEST))
    }
    else next(new ApiError("You're not logged In", StatusCodes.BAD_REQUEST))
    
})


const role =([...parames])=> expressAsyncHandler(async function(req:Request,res:Response,next:NextFunction){    
    if (parames.includes(req.user.role)) {
        next()
    }
    else
        next(new ApiError("this Route doesn't allowed to you",StatusCodes.BAD_REQUEST))
})

export {protect,role}