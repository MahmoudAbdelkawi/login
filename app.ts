import path from 'path'
import express,{ NextFunction, Request, Response, json, urlencoded } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "./utils/ApiError";
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config()
import authRoute from './routes/authRoute'
import userRoute from './routes/userOperations'
import { connect, set } from "mongoose";
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import cors from 'cors';
const app  = express();
declare global {
  namespace Express {
    interface Request {
      user: any,
      searchUser:any
      fileName:string
    }
  }
}
app.use(logger('dev'));
app.use(express.json({limit:'20kb'})) // limit the request
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(hpp({whitelist:['']})) // not sending array 
app.use(mongoSanitize()); // prevent sql injection
app.use(express.static(path.join(__dirname,'/images/')))
app.use(cookieParser());
app.use(helmet())
app.use(cors())
app.use("/auth",authRoute)
app.use("/user",userRoute)

set('strictQuery', true);
connect(`${process.env.MONGO_DB}`).then(()=>{
  console.log("the DB is working....");
}).catch((err)=>{
  console.log("DB isn't Working....");
})

app.use("*",function(req, res, next) {
  next(new ApiError("Page Not Found",StatusCodes.NOT_FOUND));
});

// error handler
app.use((err:ApiError, req:Request, res:Response, next:NextFunction)=> {
    res.status(err.statusCode || 401).json({message:err.message , stack:err.stack,success:false})
});

app.listen(4000,()=>{
  console.log("server is running.....");
})

process.on("unhandledRejection",(err:ApiError)=>{
  console.log(err.name);
  console.log(err.message);
})

module.exports = app;
