/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import  httpStatus  from 'http-status-codes';
import { AuthServices } from "./auth.service";
import AppError from "../../errorhelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";





const credentialsLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
//   const result = await UserServices. getAllUser();


const loginInfo = await AuthServices.credentialsLogin(req.body)

// res.cookie("accessToken",loginInfo.accessToken,{
//   httpOnly: true,
//   secure:false
// })

setAuthCookie(res,loginInfo)
// res.cookie("refreshToken",loginInfo.refreshToken,{
//   httpOnly:true,
//   secure: false,
// })
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

// res.cookie("accessToken",tokenInfo.accessToken,{
//   httpOnly:true,
//   secure: false,
// })
setAuthCookie(res,tokenInfo)
   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"New Access Token Retrived Successfully",
    data: tokenInfo,
   
  })



})


const logOut = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
//   const result = await UserServices. getAllUser();

  res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"User Logged Out successfully",
    data: null,
   
  })



})


const resetPassword = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
//   const result = await UserServices. getAllUser();

  
   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"User Logged Out successfully",
    data: null,
   
  })



})




export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut
}