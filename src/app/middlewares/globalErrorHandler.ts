/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorhelpers/AppError";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { string } from "zod";

interface TErrorSources = {
    path:string,
    message: string,

}


const handleDuplicateError =(err:any)=>{
     const marchedArray = err.message.match(/"([^"]*)"/)
     return{
        statusCode: 400,
        message:`${marchedArray[1]} already exists`
     }
}


const handlerCastError =(err:mongoose.Error.CastError)=>{
    return{
         statusCode :400,
        message:"Invalid MongoDB  object ID.please provide a valid id"
    }

}

const handleValidationError =(err:mongoose.Error.ValidationError)=>{
    const errorSources:TErrorSources[] =[]
      statusCode = 400;
        const errors= Object.values(err.errors)
      
        errors.forEach((errorObject: any) =>errorSources.push({
            path:errorObject.path,
            message:errorObject.message
        }))
       
        
     
        return{ 
            StatusCode: 400,
            message:"validation error"

        }
    
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler=(err:any ,req:Request,res:Response,next:NextFunction)=>{
    console.log(err)

      const errorSources:any = [
        //     {
        //     path:"isDeleted",
        //     message:"Cast Failed"
        // }
    ]
      
    let statusCode = 500;
    let message =`Something is wrong!!  `

    // duplicate error
    if(err.code === 11000){
        console.log("duplicate error");
      const simplifiedError = handleDuplicateError(err)
        statusCode =simplifiedError.statusCode;
       message = simplifiedError.message
    }
    // object ID error /cast error
    else if(err.name === "CastError"){
      const simplifiedError = handlerCastError(err)
      statusCode =simplifiedError.statusCode;
       message = simplifiedError.message
      
    }

    else if (err.name === "ZodError"){
        statusCode=400
        message="zod error"
        console.log(err.issues)
        err.issues.forEach((issue:any)=>{
         errorSources.push({
                path:issue.path[issue.path.length -1],
                message: issue.message
            })
        })
    }
    else if(err.name === 'ValidationError'){
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.StatusCode
        const errors= Object.values(err.errors)
      
        errors.forEach((errorObject: any) =>errorSources.push({
            path:errorObject.path,
            message:errorObject.message
        }))
       
        
        message="validation error"
    }
   else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }
    else if(err instanceof Error){
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success:false,
        message,
        errorSources,
        err,
        stack: envVars.NODE_ENV==="development"?err.stack:null
    })
}