/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorhelpers/AppError";
import mongoose from "mongoose";

import { string } from "zod";

import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handlerCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/error.types";





// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler=(err:any ,req:Request,res:Response,next:NextFunction)=>{
    if(envVars.NODE_ENV==='development'){
        console.log(err)
    }
 

     let errorSources:TErrorSources[] = [
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
       const simplifiedError = handleZodError(err)
       statusCode = simplifiedError.StatusCode
       message = simplifiedError.message
       errorSources = simplifiedError.errorSources
        
    }
    else if(err.name === "ValidationError"){
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message=simplifiedError.message
       
        
       
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
        err:envVars.NODE_ENV==='development'?err:null,
        stack: envVars.NODE_ENV==="development"?err.stack:null
    })
}