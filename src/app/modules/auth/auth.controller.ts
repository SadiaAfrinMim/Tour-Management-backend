/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import  httpStatus  from 'http-status-codes';
import { AuthServices } from "./auth.service";
import AppError from "../../errorhelpers/AppError";





const credentialsLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
//   const result = await UserServices. getAllUser();


const loginInfo = await AuthServices.credentialsLogin(req.body)

res.cookie("accessToken",loginInfo.accessToken,{
  httpOnly: true,
  secure:false
})
res.cookie("refreshToken",loginInfo.refreshToken,{
  httpOnly:true,
  secure: false,
})
   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"user login successfully",
    data: loginInfo,
   
  })



})



const getNewAccessToken = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
//   const result = await UserServices. getAllUser();
const refreshToken = req.cookies.refreshToken;


if(!refreshToken){
  throw new AppError( httpStatus.BAD_REQUEST,"no refresh token recived from cookie")
}
const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)
   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"user login successfully",
    data: tokenInfo,
   
  })



})





export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}