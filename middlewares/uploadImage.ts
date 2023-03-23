import sharp from 'sharp'
import multer, { memoryStorage }  from 'multer';
import  expressAsyncHandler  from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/ApiError';

const storage = memoryStorage()

const multerFilter = (req:Request,file:Express.Multer.File,cb:any)=>{
	if(file.mimetype.startsWith("image"))
		cb(null , true)
	else 
		cb(new ApiError("the file must be image" , 400),false)

}

const upload = multer({storage:storage , fileFilter:multerFilter}) // the place which the images will add on it

const uploadMiddlewareImage = upload.single("image")/* "image"  is the name of attribute which sent from the client body Parser*/


const imageResizing = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{ 
	// the extention is required
       
	const id:string = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        
	const fileName : string = `Mahmoud-${id}-${Date.now()}`
        
	await sharp(req.file?.buffer).resize(600 , 600).toFormat("jpeg")

    .jpeg({quality:90})

	.toFile(`images/${fileName}.jpeg`) 

    req.fileName =`${fileName}.jpeg`

	next() 
})

export {uploadMiddlewareImage , imageResizing}