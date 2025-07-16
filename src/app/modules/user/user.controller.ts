/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"

import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import AppError from "../../errorhelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { User } from './user.model';
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const user = await UserServices.createUser(req.body)
  // res.status(httpStatus.CREATED).json({
  //   message:"user created successfully",
  //   user
  // })

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message:"user create successfully",
    data:user,
  })

})

const updateUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET)as JwtPayload

  const verifiedToken = req.user;
  const payload = req.body
  const user = await UserServices.updateUser(userId,payload,verifiedToken)
  // res.status(httpStatus.CREATED).json({
  //   message:"user created successfully",
  //   user
  // })

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message:"user updated successfully",
    data:user,
  })

})


// const createUser = async(req:Request,res:Response,next:NextFunction)=>{
//   try{
//     // throw new Error("fake error")
//     // throw new AppError(httpStatus.BAD_REQUEST,"fake error")
//   const user = await UserServices.createUser(req.body)
//     res.status(httpStatus.CREATED).json({
//         message:"User Created Successfully",
//         user
//     })

//   }catch(error:any){
// console.log(error);
//     next(error)
//   }
// }
const getAllUsers = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const result = await UserServices. getAllUser();
   sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message:"all user retrieve successfully",
    data: result.data,
    meta:result.meta
  })

// res.status(httpStatus.OK).json({
//   success:true,
//   message:"All Users Retrieve Successfully",
//   data:users
// })

})

export  const userControllers = {
    createUser,
    getAllUsers,
    updateUser
}

// route maching -->controller--> service-->model-->db

// sobar age model then service theke aste aste controller a jabo then route matching korbo