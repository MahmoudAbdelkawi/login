import { Schema } from "mongoose"

interface userType{
    email:string,
    password:string,
    fullName:string,
    userName:string,
    role?:string,
    passwordCreationDate?:Date,
    verificationCode?:string,
    canChangePassword?:boolean,
    bio?:string,
    profileImage?:string,
    followers?:Schema.Types.ObjectId[],
    followings?:Schema.Types.ObjectId[] ,
    posts?:Schema.Types.ObjectId[],
    saves?:Schema.Types.ObjectId[]
}

interface DecodedToken{
    id: Schema.Types.ObjectId,
    role: string,
    iat: Date,
    exp: Date
}

interface VerificationCode {
    email: string,
    subject: string,
    text: string
}

export {userType,DecodedToken,VerificationCode}