import { check } from "express-validator";
import Users from "../models/user";
import ApiError from './ApiError';
import { StatusCodes } from "http-status-codes";
import { Request } from "express";

const userNameIsFound = [
    check('userName').custom(async(userName:string , {req}) => {
        const user = await Users.findOne({userName})
        if (user) {
            req.searchUser = user
            return true
        }
        else return Promise.reject(new ApiError("User Not Found" , StatusCodes.NOT_FOUND))
    })
]

export {
    userNameIsFound
}