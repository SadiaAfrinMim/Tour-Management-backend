
import { userControllers } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { NextFunction, Request, Response, Router } from "express";
import  jwt, { JwtPayload }  from 'jsonwebtoken';
import AppError from "../../errorhelpers/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { object } from "zod";




const router = Router()

const checkAuth= (...authRoles:string)=> async(req:Request,res:Response,next:NextFunction)=>{
   try{
    const accessToken = req.headers.authorization;
    if(!accessToken){
        throw new AppError(403,"No Token Recieved")
    }

    const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET)
      

    if(!verifiedToken){
        console.log(verifiedToken)
        throw new AppError(403,`you are not authorized ${verifiedToken}`)
    }

    if((verifiedToken as JwtPayload ).role !==Role.ADMIN){
        throw new AppError(403,"you are not permitted to view this route!!")

    }
    console.log(verifiedToken)
    next()

   }catch(error){
    next(error)

   }

}

router.post("/register",
    validateRequest(createUserZodSchema),
userControllers.createUser);
router.get("/all-users",checkAuth("ADMIN","SUPER_ADMIN"),userControllers.getAllUsers)

export const UserRoutes = router