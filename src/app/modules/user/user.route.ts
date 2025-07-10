import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import  { AnyZodObject } from "zod"
import { createUserZodSchema } from "./user.validation";



const validateRequest = (zodSchema:AnyZodObject)=>async(req:Request,res:Response,next:NextFunction)=>{
  try{
       req.body =await zodSchema.parseAsync(req.body)
   
    next()

  }catch(error){
    next(error)

  }
}
const router = Router()

router.post("/register",
    validateRequest(createUserZodSchema),
userControllers.createUser);
router.get("/all-users",userControllers.getAllUsers)

export const UserRoutes = router