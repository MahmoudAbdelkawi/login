import { Router } from "express";
import { protect, role } from "../middlewares/protect";
import { userNameIsFound } from "../utils/userValidation";
import validResult from "../middlewares/validationResult";
import { getUserLoggedData, searchForUser, updateBio, updateImage } from "../controllers/userServices";
import { imageResizing, uploadMiddlewareImage } from "../middlewares/uploadImage";

const router:Router = Router();

router.get('/:userName', protect ,role(["user"]) , userNameIsFound , validResult ,searchForUser)
router.post('/', protect ,role(["user"]),getUserLoggedData)
router.put('/updateBio', protect ,role(["user"]) , updateBio)
router.put('/updateImage', protect ,role(["user"]) , uploadMiddlewareImage, imageResizing , updateImage)

export default router
